"use client";
import React from "react";
import { capitalizeWords, checkName, takePicture } from "../../lib/utils";
import { useFacesContext } from "../../context/faces-context";
import { useLoadingContext } from "../../context/loading-context";

export default function NameForm() {
  const { facesLength, setFaces, setFacesLength } = useFacesContext();
  const {videoLoaded, setVideoLoaded} = useLoadingContext()
  return (
    <form
      action={async (formData) => {
        const name = formData.get("name")?.toString();
        if (checkName(name, facesLength) && name) {
          takePicture(capitalizeWords(name), setFaces, setFacesLength, videoLoaded, setVideoLoaded);
        }
      }}
    >
      <input type="text" name="name" placeholder="Name" required />
      <button className="snapshotButton">Take Snapshot</button>
    </form>
  );
}
