"use client";
import React, { useState, createContext, useContext } from "react";

type Faces = string[] | undefined;

type FacesContextType = {
  faces: Faces;
  setFaces: React.Dispatch<React.SetStateAction<string[] | undefined>>;
};

const FacesContext = createContext<FacesContextType | null>(null);

type FacesContextProviderProps = {
  children: React.ReactNode;
};

export default function FacesContextProvider({
  children,
}: FacesContextProviderProps) {
  const [faces, setFaces] = useState<string[]>();

  return (
    <FacesContext.Provider value={{ faces, setFaces }}>
      {children}
    </FacesContext.Provider>
  );
}

export function useFacesContext() {
  const context = useContext(FacesContext);

  if (context === null) {
    throw new Error(
      "useFacesContext must be used within a FacesContextProvider"
    );
  }
  return context;
}
