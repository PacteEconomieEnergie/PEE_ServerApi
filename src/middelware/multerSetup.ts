import multer from 'multer';
import { RequestHandler,Request } from "express"

const storage=multer.memoryStorage()

const upload=multer({
    storage:storage,
    limits:{
        fileSize:1024*1024*80 //80MB
    },


fileFilter:(req:Request,file:any,cb:any)=>{
    
      
    if (file.mimetype !== 'application/pdf') {
        throw new Error('Invalid file type. Only PDF files are allowed.');
    }
    cb(null, true);
}
})


export const uploadFile:RequestHandler=upload.single('pdfFile')