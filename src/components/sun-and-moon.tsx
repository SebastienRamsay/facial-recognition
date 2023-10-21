"use client"
import Image from "next/image";
import React, { useEffect, useState } from "react";

export default function SunAndMoon() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check for dark mode when the component mounts
    setIsDarkMode(window.matchMedia("(prefers-color-scheme: dark)").matches);

    // Update isDarkMode if it changes in the future
    const darkModeListener = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);
    const darkModeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    darkModeMediaQuery.addEventListener("change", darkModeListener);

    return () => {
      // Clean up the listener when the component unmounts
      darkModeMediaQuery.removeEventListener("change", darkModeListener);
    };
  }, []);

  return (
    <div>
      {isDarkMode !== undefined ? isDarkMode === true ? (
        <Image src="/pics/moon.png" alt="moon" width={1000} height={1000} className="sun-and-moon" />
      ) : (
        <Image src="/pics/sun.png" alt="sun" width={500} height={500} className="sun-and-moon" />
      ): <></>}
    </div>
  );
}
