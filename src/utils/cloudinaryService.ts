// utils/cloudinaryService.ts
import axios from "axios";

// Configuration with your preset values
const cloudinaryConfig = {
  cloudName: "dxrez1nqd",
  uploadPresets: {
    customers: "eventix",
    events: "eventix_events",
  },
  // Keep backward compatibility
  uploadPreset: "eventix",
};

// Generic upload function
const uploadToCloudinary = async (
  file: File,
  uploadPreset: string
): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

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

// Original function - maintains backward compatibility
export const uploadImage = async (file: File): Promise<string> => {
  return uploadToCloudinary(file, cloudinaryConfig.uploadPreset);
};

// New specific upload functions
export const uploadCustomerImage = async (file: File): Promise<string> => {
  return uploadToCloudinary(file, cloudinaryConfig.uploadPresets.customers);
};

export const uploadEventImage = async (file: File): Promise<string> => {
  return uploadToCloudinary(file, cloudinaryConfig.uploadPresets.events);
};

// Utility function to validate file before upload
export const validateImageFile = (
  file: File
): { isValid: boolean; error?: string } => {
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
  ];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error:
        "Invalid file type. Please upload JPG, PNG, GIF, or WebP images only.",
    };
  }

  if (file.size > maxSize) {
    return {
      isValid: false,
      error: "File size too large. Please upload images smaller than 5MB.",
    };
  }

  return { isValid: true };
};

// Enhanced upload functions with validation
export const uploadCustomerImageWithValidation = async (
  file: File
): Promise<string> => {
  const validation = validateImageFile(file);
  if (!validation.isValid) {
    throw new Error(validation.error);
  }
  return uploadCustomerImage(file);
};

export const uploadEventImageWithValidation = async (
  file: File
): Promise<string> => {
  const validation = validateImageFile(file);
  if (!validation.isValid) {
    throw new Error(validation.error);
  }
  return uploadEventImage(file);
};

// Export config for other uses
export { cloudinaryConfig };
