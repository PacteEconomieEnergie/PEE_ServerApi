// validationMiddleware.js

import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from "express";
const userValidationRules = () => {
    return [
        body('Email').isEmail().withMessage('Invalid email format'),
        body('Password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
        body('Role').isIn(['ADMIN', 'ENGINEER','ASSISTANT']).withMessage('Invalid role specified')
    ];
};

const loginValidationRules = () => {
    return [
        body('Email').isEmail().withMessage('Invalid email format'),
        body('Password').exists().withMessage('Password is required')
    ];
};

const validate = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

export { userValidationRules, loginValidationRules,validate };
