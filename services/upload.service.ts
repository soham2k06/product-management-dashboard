import axios, { AxiosProgressEvent } from "axios";
import { CloudinaryUploadResponse } from "@/types";
import {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_UPLOAD_PRESET,
} from "@/config/constants";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export const validateImageFile = (file: File): void => {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error("Only JPG, PNG, and WEBP images are allowed.");
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error("File size must be less than 5MB.");
  }
};

export const uploadService = async (
  file: File,
  onProgress?: (percentage: number) => void,
  signal?: AbortSignal,
): Promise<CloudinaryUploadResponse> => {
  validateImageFile(file);

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

  const response = await axios.post<CloudinaryUploadResponse>(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
    formData,
    {
      signal,
      onUploadProgress: (event: AxiosProgressEvent) => {
        if (!event.total) return;

        const percent = Math.round((event.loaded * 100) / event.total);
        onProgress?.(percent);
      },
    },
  );

  return response.data;
};
