// utils/cloudinaryService.ts
import axios from "axios";
import { cloudinaryConfig } from "../config/cloudinary";

export const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", cloudinaryConfig.uploadPreset);

  try {
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/upload`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 15000,
      }
    );

    return response.data.secure_url;
  } catch (error) {
    console.error("Upload failed:", error);
    throw new Error("Image upload failed. Please try again.");
  }
};
