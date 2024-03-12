import multer from 'multer';
import { RequestHandler,Request } from "express"

const storage=multer.memoryStorage()


const fileFilter = (req: Request, file: any, cb: multer.FileFilterCallback) => {
  const allowedMimeTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/gif'];
  console.log(file);
  
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true); // Accept file
    }
    else {
      // Only call the callback once with an error if the file type is not allowed
      cb(new Error('Invalid file type. Only PDF, JPEG, PNG, and GIF files are allowed.') as any, false);
    }
  };

  export const upload = multer({
    storage: storage,
    limits: {
      fileSize: 1024 * 1024 * 80, // 80MB
    },
    fileFilter: fileFilter,
  });


  export const uploadFile = (fieldName: string): RequestHandler => {
    return upload.single(fieldName);
  }; 