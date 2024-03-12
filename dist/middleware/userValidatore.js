"use strict";
// validationMiddleware.js
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = exports.loginValidationRules = exports.userValidationRules = void 0;
const express_validator_1 = require("express-validator");
const userValidationRules = () => {
    return [
        (0, express_validator_1.body)('Email').isEmail().withMessage('Invalid email format'),
        (0, express_validator_1.body)('Password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
        (0, express_validator_1.body)('Role').isIn(['ADMIN', 'ENGINEER', 'ASSISTANT']).withMessage('Invalid role specified')
    ];
};
exports.userValidationRules = userValidationRules;
const loginValidationRules = () => {
    return [
        (0, express_validator_1.body)('Email').isEmail().withMessage('Invalid email format'),
        (0, express_validator_1.body)('Password').exists().withMessage('Password is required')
    ];
};
exports.loginValidationRules = loginValidationRules;
const validate = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};
exports.validate = validate;
