import multer from 'multer';
import { RequestHandler,Request } from "express"

const storage=multer.memoryStorage()


const fileFilter = (req: Request, file: any, cb: multer.FileFilterCallback) => {
    if (file.mimetype !== 'application/pdf') {
      return cb(new Error('Invalid file type. Only PDF files are allowed.'));
    }
    cb(null, true);
  };

  export const upload = multer({
    storage: storage,
    limits: {
      fileSize: 1024 * 1024 * 80, // 80MB
    },
    fileFilter: fileFilter,
  });


export const uploadFile:RequestHandler=upload.single('pdfFile') 