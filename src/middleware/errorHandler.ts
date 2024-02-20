import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client'; // Import Prisma types

// Define a custom error type that includes a status property
interface ErrorWithStatus extends Error {
  status?: number;
}

// Enhanced Global Error Handler Middleware
export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(`Error : ${err}, Message: ${err.message}, Stack: ${err.stack}`);

    const isDevelopment = process.env.NODE_ENV === 'development';
    // Initially include the stack property in the errorResponse object, marked as optional
    let errorResponse: {
        status: number;
        message: string;
        stack?: string; // Optional stack property
    } = {
        status: 500,
        message: isDevelopment ? err.message : 'Internal Server Error',
    };

    if (isDevelopment && err.stack) {
        // Add the stack to errorResponse if in development mode and stack is present
        errorResponse.stack = err.stack;
    }

    // Specific handling for PrismaClientKnownRequestError instances
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        // Customize the response based on the error code
        if (err.code === 'P2002') {
            errorResponse.status = 400; // Bad Request
            errorResponse.message = 'A unique constraint violation occurred.';
        } else {
            // Handle other specific Prisma errors
            errorResponse.message = 'A database error occurred.';
        }
    }

    res.status(errorResponse.status).json(errorResponse);
};
