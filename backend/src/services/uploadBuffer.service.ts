import streamifier from "streamifier";
import cloudinary from "../config/cloudinary.js";

export function uploadBuffer(
  buffer: Buffer,
  folder: string,
  resourceType: "image" | "raw",
) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType,
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      },
    );

    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
}
