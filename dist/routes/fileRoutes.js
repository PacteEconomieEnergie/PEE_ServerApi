"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// fileRoutes.ts
const express_1 = __importDefault(require("express"));
const prismaClient_1 = require("../utils/prismaClient"); // Update the import path according to your project structure
const router = express_1.default.Router();
router.get("/download/:fileId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const fileId = parseInt(req.params.fileId);
    try {
        const file = yield prismaClient_1.prisma.files.findUnique({
            where: { idFiles: fileId }
        });
        if (!file) {
            res.status(404).json({ message: 'File not found' });
            return;
        }
        const fileBuffer = file.FileContent;
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=${file.FileName}`);
        res.send(fileBuffer);
    }
    catch (error) {
        console.error('Error downloading file:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}));
exports.default = router;
