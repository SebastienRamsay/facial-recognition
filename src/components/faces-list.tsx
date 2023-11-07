"use client";
import React from "react";
import { MdDeleteForever } from "react-icons/md";
import { removeFace } from "../../lib/utils";
import { useFacesContext } from "../../context/faces-context";

export default function FacesList() {
  const { faces, setFaces } = useFacesContext();
  return (
    <ul>
      {faces ? (
        faces.length > 0 ? (
          faces.map((face, i) => (
            <li key={i}>
              😁 {face}
              <button
                onClick={async () => removeFace(face, faces, setFaces)}
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
        <h1>loading faces</h1>
      )}
    </ul>
  );
}
