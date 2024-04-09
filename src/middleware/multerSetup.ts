import multer from 'multer';
import { RequestHandler,Request } from "express"

const storage=multer.memoryStorage()


const fileFilter = (req: Request, file: any, cb: multer.FileFilterCallback) => {
  if (!file) {
    throw new Error('File is missing');
}
  const allowedMimeTypes = [
    'application/pdf', 
    'image/jpeg', 
    'image/png', 
    'image/gif',
    'application/zip', 
    'application/x-zip-compressed', 
    'application/x-compressed', 
    'multipart/x-zip', 
    'application/x-rar-compressed', 
    'application/octet-stream', 
    'application/x-msdownload', 
    'application/x-msdos-program' // This is for your specific case with RAR files
  ];

  console.log(req.file,'fromt the multer');
  
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true); // Accept file
    }
    else {
      // Only call the callback once with an error if the file type is not allowed
      cb(new Error('Invalid file type. Only PDF, JPEG, PNG, and GIF files are allowed.') as any, false);
    }
  };

  export const upload = multer({  
    limits: {
      fileSize: 1024 * 1024 * 150, // 150MB
    },
    fileFilter: fileFilter,
  });


  export const uploadFile = (fieldName: string): RequestHandler => {
    return upload.single(fieldName);
  };   