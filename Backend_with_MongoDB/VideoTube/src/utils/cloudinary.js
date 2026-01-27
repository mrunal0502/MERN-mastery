import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import streamifier from "streamifier";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload buffer directly to Cloudinary (no disk I/O)
const uploadOnCloudinary = async (buffer) => {
  try {
    if (!buffer) return null;

    console.log(
      "Uploading buffer to cloudinary (size:",
      buffer.length,
      "bytes)"
    );

    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: "auto" },
        (error, response) => {
          if (error) return reject(error);
          resolve(response);
        }
      );

      streamifier.createReadStream(buffer).pipe(uploadStream);
    });

    console.log("File uploaded on cloudinary. File src:", result?.url);
    return result;
  } catch (err) {
    console.log("error on cloudinary", err);
    return null;
  }
};

const deleteFromCloudinary = async (publicId) => {
  try {
    const result = cloudinary.uploader.destroy(publicId);

    console.log("Deleted from cloudinary");
  } catch (err) {
    console.log("Error deleteing from cloudinary");
  }
};

export { uploadOnCloudinary, deleteFromCloudinary };
