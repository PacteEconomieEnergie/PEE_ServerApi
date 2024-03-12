"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const config = {
    port: process.env.PORT || 3002,
    corsOrigin: process.env.CORS_ORIGIN || '*',
};
exports.default = config;
