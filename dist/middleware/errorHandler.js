"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const client_1 = require("@prisma/client"); // Import Prisma types
// Enhanced Global Error Handler Middleware
const errorHandler = (err, req, res, next) => {
    console.error(`Error : ${err}, Message: ${err.message}, Stack: ${err.stack}`);
    const isDevelopment = process.env.NODE_ENV === 'development';
    // Initially include the stack property in the errorResponse object, marked as optional
    let errorResponse = {
        status: 500,
        message: isDevelopment ? err.message : 'Internal Server Error',
    };
    if (isDevelopment && err.stack) {
        // Add the stack to errorResponse if in development mode and stack is present
        errorResponse.stack = err.stack;
    }
    // Specific handling for PrismaClientKnownRequestError instances
    if (err instanceof client_1.Prisma.PrismaClientKnownRequestError) {
        // Customize the response based on the error code
        if (err.code === 'P2002') {
            errorResponse.status = 400; // Bad Request
            errorResponse.message = 'A unique constraint violation occurred.';
        }
        else {
            // Handle other specific Prisma errors
            errorResponse.message = 'A database error occurred.';
        }
    }
    res.status(errorResponse.status).json(errorResponse);
};
exports.errorHandler = errorHandler;
