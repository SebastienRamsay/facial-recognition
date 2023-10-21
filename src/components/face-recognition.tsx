"use client";
import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import {
  saveImage,
  getNumberOfFiles,
  getFolderNames,
  deleteFace,
} from "../../actions/database";
import toast from "react-hot-toast/headless";

const faceDetectionNet = faceapi.nets.ssdMobilenetv1;
// SsdMobilenetv1Options
const minConfidence = 0.8;

// TinyFaceDetectorOptions
const inputSize = 408;
const scoreThreshold = 0.5;

const FaceRecognition: React.FC = () => {
  var hasMounted = useRef(false);
  const [faces, setFaces] = useState<string[]>();

  async function setupVideo() {
    const video = document.getElementById("video") as HTMLVideoElement;
    const canvas = document.createElement("canvas"); // Create a new canvas element
    canvas.id = "canvas";
    await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
    await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
    await faceapi.nets.faceRecognitionNet.loadFromUri("/models");
    await faceapi.nets.faceExpressionNet.loadFromUri("/models");
    await faceapi.nets.ageGenderNet.loadFromUri("/models");
    await faceapi.nets.ssdMobilenetv1.loadFromUri("/models");

    const labeledFaceDescriptors = await loadLabeledImages();
    var faceMatcher: faceapi.FaceMatcher;
    if (labeledFaceDescriptors.length > 0) {
      faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.6);
    }

    startVideo(video);

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
    }, 100);

    video.addEventListener("pause", () => {
      clearInterval(interval);
    });
  }

  useEffect(() => {
    if (hasMounted.current) {
      // Component has already mounted, it's a remount
      console.log("Component remounted");
      return;
    }
    hasMounted.current = true;

    setupVideo();

    return () => {
      // Cleanup actions for the video
      const video = document.getElementById("video") as HTMLVideoElement;
      if (video) {
        video.pause(); // Pause the video
        video.src = ""; // Clear the video source
      }
    };
  }, []);

  function startVideo(video: HTMLVideoElement) {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        video.srcObject = stream;
      })
      .catch((error) => {
        console.error(error);
      });
  }

  async function loadLabeledImages() {
    const labels =
      (await getFolderNames(
        "C:/Users/sebas/Documents/.ProgramingProjects/facial-recognition/public/labeled_images/"
      )) ?? [];
    setFaces(labels);
    const labeledFaceDescriptorsPromises = labels.map(async (label: string) => {
      const numberOfPics =
        (await getNumberOfFiles(
          "C:/Users/sebas/Documents/.ProgramingProjects/facial-recognition/public/labeled_images/" +
            label
        )) ?? 0;

      if (numberOfPics < 0) {
        return undefined;
      }

      const descriptions = [];
      for (let i = 1; i <= numberOfPics; i++) {
        console.log("LABEL: ", label);
        const img = await faceapi.fetchImage(
          `http://localhost:2443/labeled_images/${label}/${i}.jpg`
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
    });

    const labeledFaceDescriptors = await Promise.all(
      labeledFaceDescriptorsPromises
    );
    return labeledFaceDescriptors.filter(
      (descriptor) => descriptor !== undefined
    );
  }

  const takePicture = async (name: string) => {
    const video = document.getElementById("video") as HTMLVideoElement;
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    const context = canvas.getContext("2d");

    if (context) {
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageDataURL = canvas.toDataURL("image/jpeg");

      await saveImage(imageDataURL, name);
    }
    await reloadFaceRecognition(canvas);
  };

  const removeFace = async (face: string) => {
    if (faces) {
      setFaces(faces.filter((f) => f !== face));
    }
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;

    await deleteFace(face);
    await reloadFaceRecognition(canvas);
  };
  async function reloadFaceRecognition(canvas: HTMLCanvasElement) {
    await loadLabeledImages();
    canvas.remove();
    await setupVideo();
  }

  return (
    <div className="facial-recognition-container">
      <span className="video-container">
        <video
          id="video"
          className="video"
          autoPlay
          width="720"
          height="560"
          muted
        />
      </span>

      <form
        action={async (formData) => {
          const name = formData.get("name")?.toString();
          if (!name) {
            toast.error("Name required");
            return;
          }
          if (name.length < 3) {
            toast.error("Name must be longer than 3 characters");
            return;
          }
          if (name.length > 15) {
            toast.error("Name must be shorter than 15 characters");
            return;
          }
          takePicture(
            name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()
          );
        }}
      >
        <input type="text" name="name" placeholder="Name" required />
        <button className="snapshotButton">Take Snapshot</button>
      </form>
      <ul>
        {faces ? (
          faces.length > 0 ? (
            faces.map((face, i) => (
              <li key={i}>
                😁 {face}
                <button
                  onClick={async () => removeFace(face)}
                  className="delete-button"
                >
                  X
                </button>
              </li>
            ))
          ) : (
            <h1>no known faces</h1>
          )
        ) : (
          <h1>loading faces</h1>
        )}
      </ul>
    </div>
  );
};

export default FaceRecognition;
