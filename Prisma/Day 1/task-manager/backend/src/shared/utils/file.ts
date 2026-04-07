import fs from "fs";
import path from "path";

export const uploadsDirectory = path.join(process.cwd(), "uploads");

export const ensureUploadsDirectory = (): void => {
  if (!fs.existsSync(uploadsDirectory)) {
    fs.mkdirSync(uploadsDirectory, { recursive: true });
  }
};

export const sanitizeFileName = (fileName: string): string => {
  return fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
};

export const createUploadFileName = (fileName: string): string => {
  const uniquePrefix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
  return `${uniquePrefix}-${sanitizeFileName(fileName)}`;
};

export const buildAttachmentUrl = (
  protocol: string,
  host: string,
  fileName: string,
): string => {
  return `${protocol}://${host}/uploads/${fileName}`;
};

export const resolveUploadPathFromUrl = (fileUrl: string): string => {
  const attachmentPath = new URL(fileUrl).pathname;
  return path.join(process.cwd(), attachmentPath.replace(/^\/+/, ""));
};
