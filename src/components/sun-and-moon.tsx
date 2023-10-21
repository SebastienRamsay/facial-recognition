"use client";
import React from "react";

export default function SunAndMoon() {
  const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
  return (
    <div className="sun-and-moon-container">
      {isDarkMode ? (
        <img src={"/pics/moon.png"} alt="moon" className="sun-and-moon" />
      ) : (
        <img src={"/pics/sun.png"} alt="sun" className="sun-and-moon" />
      )}
    </div>
  );
}
