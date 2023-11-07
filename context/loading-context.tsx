"use client";
import React, { useState, createContext, useContext } from "react";

type LoadingContextType = {
  videoLoaded: Boolean;
  setVideoLoaded: React.Dispatch<React.SetStateAction<boolean>>;
};

const LoadingContext = createContext<LoadingContextType | null>(null);

type LoadingContextProviderProps = {
  children: React.ReactNode;
};

export default function LoadingContextProvider({
  children,
}: LoadingContextProviderProps) {
  const [videoLoaded, setVideoLoaded] = useState(false);

  return (
    <LoadingContext.Provider value={{ videoLoaded, setVideoLoaded }}>
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoadingContext() {
  const context = useContext(LoadingContext);

  if (context === null) {
    throw new Error(
      "useLoadingContext must be used within a LoadingContextProvider"
    );
  }
  return context;
}
