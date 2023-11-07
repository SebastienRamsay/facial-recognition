import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import FacesContextProvider from "../../context/faces-context";
import LoadingContextProvider from "../../context/loading-context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Facial Recognition",
  description: "Created by Sebastien Ramsay using face-api",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <LoadingContextProvider>
          <FacesContextProvider>
            {children}
            <Toaster position="top-right" reverseOrder={false} />
          </FacesContextProvider>
        </LoadingContextProvider>
      </body>
    </html>
  );
}
