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
// statsRoutes.ts
const express_1 = __importDefault(require("express"));
const prismaClient_1 = require("../utils/prismaClient");
const router = express_1.default.Router();
router.get('/dashboard', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const engineersCount = yield prismaClient_1.prisma.users.count({
            where: { Role: 'ENGINEER' },
        });
        const assistantsCount = yield prismaClient_1.prisma.users.count({
            where: { Role: 'ASSISTANT' },
        });
        const clientsCount = yield prismaClient_1.prisma.client.count();
        const studiesCount = yield prismaClient_1.prisma.studies.count();
        res.json({
            engineersCount,
            assistantsCount,
            clientsCount,
            studiesCount,
        });
    }
    catch (error) {
        console.error('Error fetching dashboard statistics:', error);
        res.status(500).json({ message: 'Failed to fetch dashboard statistics' });
    }
}));
exports.default = router;
