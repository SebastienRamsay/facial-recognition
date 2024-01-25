"use client";
import React from "react";
import { MdDeleteForever } from "react-icons/md";
import { removeFace } from "../../lib/utils";
import { useFacesContext } from "../../context/faces-context";
import { useLoadingContext } from "../../context/loading-context";

export default function FacesList() {
  const { faces, setFaces, setFacesLength } = useFacesContext();
  const { videoLoaded, setVideoLoaded } = useLoadingContext();
  return (
    <ul>
      {faces ? (
        faces.length > 0 ? (
          faces.map((face, i) => (
            <li key={i}>
              😁 {face}
              <button
                onClick={async () =>
                  removeFace(
                    face,
                    faces,
                    setFaces,
                    setFacesLength,
                    videoLoaded,
                    setVideoLoaded
                  )
                }
                className="delete-button"
              >
                <MdDeleteForever />
              </button>
            </li>
          ))
        ) : (
          <h1>no known faces</h1>
        )
      ) : (
        <h1>loading faces...</h1>
      )}
    </ul>
  );
}
