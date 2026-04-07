import multer from "multer";
import {
  createUploadFileName,
  ensureUploadsDirectory,
  uploadsDirectory,
} from "../utils/file";

ensureUploadsDirectory();

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => {
    callback(null, uploadsDirectory);
  },
  filename: (_req, file, callback) => {
    callback(null, createUploadFileName(file.originalname));
  },
});

export const uploadAttachment = multer({
  storage,
  limits: {
    fileSize: 20 * 1024 * 1024,
  },
});
