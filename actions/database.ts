"use server";
import fs from "fs";
import path from "path";

export async function getFolderNames(directoryPath: string): Promise<string[]> {
  return new Promise((resolve, reject) => {
    fs.readdir(directoryPath, (err, files) => {
      if (err) {
        console.error("Error reading directory:", err);
        reject(err);
        return;
      }

      const folderNames = files.filter((file) => {
        const fullPath = path.join(directoryPath, file);
        return fs.statSync(fullPath).isDirectory();
      });

      console.log("Folder names:", folderNames);
      resolve(folderNames);
    });
  });
}

export async function getNumberOfFiles(directoryPath: string): Promise<number> {
  return new Promise((resolve, reject) => {
    fs.readdir(directoryPath, (err, files) => {
      if (err) {
        console.error("Error reading directory:", err);
        reject(err);
        return;
      }

      const fileCount = files.length;

      console.log("Number of files in " + directoryPath + ":", fileCount);
      resolve(fileCount);
    });
  });
}

export async function saveImage(
  imageDataURL: string,
  name: string
): Promise<void> {
  return new Promise<void>(async (resolve, reject) => {
    const base64Data = imageDataURL.replace(/^data:image\/jpeg;base64,/, "");
    const binaryData = Buffer.from(base64Data, "base64");

    try {
      const folderPath = `public/labeled_images/${name}`;
      // Create the folder if it doesn't exist
      fs.mkdir(folderPath, { recursive: true }, async (mkdirError) => {
        if (mkdirError) {
          console.error("Error creating folder:", mkdirError);
          reject(mkdirError);
        } else {
          let fileNum = await getNumberOfFiles("public/labeled_images/" + name);
          console.log(fileNum);

          const imageName = `${folderPath}/${fileNum + 1}.jpg`;
          fs.writeFile(imageName, binaryData, "binary", (writeError) => {
            if (writeError) {
              console.error("Error saving the image:", writeError);
              reject(writeError);
            } else {
              console.log("Image Saved");
              resolve();
            }
          });
        }
      });
    } catch (error) {
      console.error("Error retrieving file count:", error);
      reject(error);
    }
  });
}

export async function deleteFace(face: string): Promise<void> {
  return new Promise<void>(async (resolve, reject) => {
    try {
      const folderPath = `public/labeled_images/${face}`;
      try {
        fs.rmdirSync(folderPath, { recursive: true });
        console.log("Directory has been deleted successfully.");
        resolve();
      } catch (err) {
        console.error("Error deleting directory:", err);
      }
    } catch (error) {
      console.error("Error retrieving file count:", error);
      reject(error);
    }
  });
}
