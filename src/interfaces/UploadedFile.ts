// src/interfaces/UploadedFile.ts

export interface UploadedFile {
    originalname: string;
    mimetype: string;
    buffer: Buffer;
    size: number;
    // Add any other properties that multer provides and you need
  }
  