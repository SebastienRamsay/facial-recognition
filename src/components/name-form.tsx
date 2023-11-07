"use client";
import React from "react";
import { capitalizeWords, checkName, takePicture } from "../../lib/utils";
import { useFacesContext } from "../../context/faces-context";

export default function NameForm() {
  const { facesLength, setFaces } = useFacesContext();
  return (
    <form
      action={async (formData) => {
        const name = formData.get("name")?.toString();
        if (checkName(name, facesLength) && name) {
          takePicture(capitalizeWords(name), setFaces);
        }
      }}
    >
      <input type="text" name="name" placeholder="Name" required />
      <button className="snapshotButton">Take Snapshot</button>
    </form>
  );
}
