"use client";
import React, { useEffect, useRef } from "react";
import { useFacesContext } from "../../context/faces-context";
import { setupVideo } from "../../lib/utils";
import Typewriter from "typewriter-effect";
import { useLoadingContext } from "../../context/loading-context";

const FaceRecognition: React.FC = () => {
  var hasMounted = useRef(false);
  const { setFaces, setFacesLength } = useFacesContext();
  const { videoLoaded, setVideoLoaded } = useLoadingContext();

  useEffect(() => {
    if (hasMounted.current) {
      // Component has already mounted, it's a remount
      console.log("Component remounted");
      return;
    }
    hasMounted.current = true;

    setupVideo(setFaces, setFacesLength, videoLoaded, setVideoLoaded);

    return () => {
      // Cleanup actions for the video
      const video = document.getElementById("video") as HTMLVideoElement;
      if (video) {
        video.pause(); // Pause the video
        video.src = ""; // Clear the video source
      }
    };
  }, []);

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

      {!videoLoaded ? (
        <Typewriter
          options={{
            autoStart: true,
            loop: true,
            delay: 50,
            strings: [
              "Loading Facial Recognition Software",
              "Hacking The US Navy",
              "Your device is rather slow",
              "I'm sure nothing went wrong",
            ],
          }}
        />
      ) : null}
    </div>
  );
};

export default FaceRecognition;
