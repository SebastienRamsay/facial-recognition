"use client";
import React, { useEffect } from "react";
import * as faceapi from "face-api.js";

const FaceRecognition: React.FC = () => {
  useEffect(() => {
    async function setupVideo() {
      const video = document.getElementById("video") as HTMLVideoElement;
      const canvas = document.createElement("canvas"); // Create a new canvas element
      await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
      await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
      await faceapi.nets.faceRecognitionNet.loadFromUri("/models");
      await faceapi.nets.faceExpressionNet.loadFromUri("/models");

      startVideo(video);

      document.body.append(canvas);

      const displaySize = { width: video.width, height: video.height };
      canvas.width = displaySize.width; // Set the canvas dimensions
      canvas.height = displaySize.height;

      const context = canvas.getContext("2d");
      if (!context) {
        console.error("2D context not available");
        return;
      }

      const interval = setInterval(async () => {
        const detections = await faceapi
          .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks()
          .withFaceExpressions();
        const resizedDetections = faceapi.resizeResults(
          detections,
          displaySize
        );

        context.clearRect(0, 0, canvas.width, canvas.height);
        faceapi.draw.drawDetections(canvas, resizedDetections); // Use the canvas as the first argument
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections); // Use the canvas as the first argument
        faceapi.draw.drawFaceExpressions(canvas, resizedDetections); // Use the canvas as the first argument
      }, 100);

      video.addEventListener("pause", () => {
        clearInterval(interval);
      });
    }

    setupVideo();
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

  return (
    <div>
      <video id="video" autoPlay width="720" height="560" muted />
    </div>
  );
};

export default FaceRecognition;
