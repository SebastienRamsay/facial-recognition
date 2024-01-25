import toast from "react-hot-toast";
import * as faceapi from "face-api.js";
import {
  deleteFace,
  getFolderNames,
  getNumberOfFiles,
  saveImage,
} from "../actions/database";

export const checkName = (name: string | undefined, facesLength: number) => {
  if (facesLength < 1) {
    toast.error("I can't see your beautiful face");
    return false;
  }

  if (facesLength > 1) {
    toast.error("too many faces at once");
    return false;
  }

  if (!name) {
    toast.error("Name required");
    return false;
  }
  if (name.length < 2) {
    toast.error("Name must be more than 1 character");
    return false;
  }
  if (name.length > 15) {
    toast.error("Name must be less than 15 characters");
    return false;
  }
  return true;
};

export async function startVideo(video: HTMLVideoElement) {
  navigator.mediaDevices
    .getUserMedia({ video: true })
    .then((stream) => {
      video.srcObject = stream;
    })
    .catch((error) => {
      console.error(error);
    });
}

export function capitalizeWords(name: string) {
  return name
    .replace(/\b\w/g, function (match) {
      return match.toUpperCase();
    })
    .trim();
}

export async function reloadFaceRecognition(
  canvas: HTMLCanvasElement,
  setFaces: React.Dispatch<React.SetStateAction<string[] | undefined>>,
  setFacesLength: React.Dispatch<React.SetStateAction<number>>,
  videoLoaded: Boolean,
  setVideoLoaded: React.Dispatch<React.SetStateAction<boolean>>
) {
  canvas.remove();
  await setupVideo(setFaces, setFacesLength, videoLoaded, setVideoLoaded);
}

export async function setupVideo(
  setFaces: React.Dispatch<React.SetStateAction<string[] | undefined>>,
  setFacesLength: React.Dispatch<React.SetStateAction<number>>,
  videoLoaded: Boolean,
  setVideoLoaded: React.Dispatch<React.SetStateAction<boolean>>
) {
  const faceDetectionNet = faceapi.nets.ssdMobilenetv1;
  // SsdMobilenetv1Options
  const minConfidence = 0.8;

  // TinyFaceDetectorOptions
  const inputSize = 408;
  const scoreThreshold = 0.5;
  const video = document.getElementById("video") as HTMLVideoElement;
  const canvas = document.createElement("canvas"); // Create a new canvas element
  canvas.id = "canvas";
  await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
  await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
  await faceapi.nets.faceRecognitionNet.loadFromUri("/models");
  await faceapi.nets.faceExpressionNet.loadFromUri("/models");
  await faceapi.nets.ageGenderNet.loadFromUri("/models");
  await faceapi.nets.ssdMobilenetv1.loadFromUri("/models");

  const labeledFaceDescriptors = await loadLabeledImages(setFaces);
  var faceMatcher: faceapi.FaceMatcher;
  if (labeledFaceDescriptors.length > 0) {
    faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.6);
  }

  await startVideo(video);

  const videoContainer = document.querySelector(".video-container");
  if (videoContainer) videoContainer.appendChild(canvas);

  const displaySize = { width: video.width, height: video.height };
  canvas.width = displaySize.width; // Set the canvas dimensions
  canvas.height = displaySize.height;

  const context = canvas.getContext("2d");
  if (!context) {
    console.error("2D context not available");
    return;
  }

  function getFaceDetectorOptions(net: faceapi.NeuralNetwork<any>) {
    return net === faceapi.nets.ssdMobilenetv1
      ? new faceapi.SsdMobilenetv1Options({ minConfidence })
      : new faceapi.TinyFaceDetectorOptions({ inputSize, scoreThreshold });
  }

  const faceDetectionOptions = getFaceDetectorOptions(faceDetectionNet);

  const interval = setInterval(async () => {
    const detections = await faceapi
      .detectAllFaces(video, faceDetectionOptions)
      .withFaceLandmarks()
      .withFaceExpressions()
      .withAgeAndGender()
      .withFaceDescriptors();
    const resizedDetections = faceapi.resizeResults(detections, displaySize);

    context.clearRect(0, 0, canvas.width, canvas.height); //clear canvas

    if (labeledFaceDescriptors.length > 0) {
      const results = resizedDetections.map((d) =>
        faceMatcher.findBestMatch(d.descriptor)
      );
      results.forEach((result, i) => {
        const box = resizedDetections[i].detection.box;
        const drawBox = new faceapi.draw.DrawBox(box, {
          label: result.toString(),
        });
        drawBox.draw(canvas);
      });
    } else {
      faceapi.draw.drawDetections(canvas, resizedDetections);
    }

    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
    faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
    setFacesLength(resizedDetections.length);
    resizedDetections.forEach((result) => {
      const { age, gender, genderProbability, expressions } = result;
      new faceapi.draw.DrawTextField(
        [
          `${faceapi.round(age, 0)} years`,
          `${gender} (${faceapi.round(genderProbability)})`,
        ],
        result.detection.box.bottomRight
      ).draw(canvas);
    });
    if (!videoLoaded) {
      setVideoLoaded(true);
    }
  }, 100);

  video.addEventListener("pause", () => {
    clearInterval(interval);
  });
}

// C:/Users/sebas/Documents/.ProgramingProjects/facial-recognition/public/labeled_images/
// /home/ramsay/Desktop/facial-recognition/public/labeled_images/
export async function loadLabeledImages(
  setFaces: React.Dispatch<React.SetStateAction<string[] | undefined>>
) {
  const labels =
    (await getFolderNames(
      "/home/ramsay/Desktop/facial-recognition/public/labeled_images/"
    )) ?? [];
  let cleanedLabels = <string[]>[];
  const labeledFaceDescriptorsPromises = labels.map(
    async (label: string, i: number) => {
      const numberOfPics =
        (await getNumberOfFiles(
          "/home/ramsay/Desktop/facial-recognition/public/labeled_images/" +
            label
        )) ?? 0;

      if (numberOfPics == 0) {
        deleteFace(label);
        console.log("EMPTY FACE FOLDER FOUND, DELETING FOLDER.");
        return undefined;
      }
      cleanedLabels.push(label);

      const descriptions = [];
      for (let i = 1; i <= numberOfPics; i++) {
        const img = await faceapi.fetchImage(
          `https://facialrecognition.ramsaysdetailing.ca/labeled_images/${label}/${i}.jpg`
        );
        const detections = await faceapi
          .detectSingleFace(img)
          .withFaceLandmarks()
          .withFaceDescriptor();
        if (detections) descriptions.push(detections.descriptor);
      }

      if (descriptions.length === 0) {
        return undefined;
      }

      return new faceapi.LabeledFaceDescriptors(label, descriptions);
    }
  );

  const labeledFaceDescriptors = await Promise.all(
    labeledFaceDescriptorsPromises
  );

  console.log(cleanedLabels);
  setFaces(cleanedLabels);

  return labeledFaceDescriptors.filter(
    (descriptor) => descriptor !== undefined
  );
}

export const takePicture = async (
  name: string,
  setFaces: React.Dispatch<React.SetStateAction<string[] | undefined>>,
  setFacesLength: React.Dispatch<React.SetStateAction<number>>,
  videoLoaded: Boolean,
  setVideoLoaded: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const video = document.getElementById("video") as HTMLVideoElement;
  const canvas = document.getElementById("canvas") as HTMLCanvasElement;
  const context = canvas.getContext("2d");

  if (context) {
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageDataURL = canvas.toDataURL("image/jpeg");

    await saveImage(imageDataURL, name);
  }
  await reloadFaceRecognition(
    canvas,
    setFaces,
    setFacesLength,
    videoLoaded,
    setVideoLoaded
  );
};

export const removeFace = async (
  face: string,
  faces: string[],
  setFaces: React.Dispatch<React.SetStateAction<string[] | undefined>>,
  setFacesLength: React.Dispatch<React.SetStateAction<number>>,
  videoLoaded: Boolean,
  setVideoLoaded: React.Dispatch<React.SetStateAction<boolean>>
) => {
  if (faces) {
    setFaces(faces.filter((f) => f !== face));
  }
  const canvas = document.getElementById("canvas") as HTMLCanvasElement;

  await deleteFace(face);
  await reloadFaceRecognition(
    canvas,
    setFaces,
    setFacesLength,
    videoLoaded,
    setVideoLoaded
  );
};
