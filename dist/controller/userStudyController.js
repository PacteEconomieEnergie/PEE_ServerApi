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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStudyUsers = exports.getUserStudies = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getUserStudies = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params; // Assuming the user ID is provided as a route parameter
    try {
        const userStudies = yield prisma.users.findUnique({
            where: {
                UserID: Number(userId), // Convert the parameter to a number if needed
            },
            select: {
                users_has_studies: {
                    include: {
                        studies: true,
                    },
                },
            },
        });
        console.log(userStudies);
        // Access the related studies for the user
        const studies = (userStudies === null || userStudies === void 0 ? void 0 : userStudies.users_has_studies.map((entry) => entry.studies)) || [];
        res.json({ studies });
    }
    catch (error) {
        res.status(500).json(error);
    }
});
exports.getUserStudies = getUserStudies;
const getStudyUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { studyId } = req.params; // Assuming the study ID is provided as a route parameter
    console.log(req.params);
    try {
        const studyUsers = yield prisma.studies.findUnique({
            where: {
                IdStudies: Number(studyId), // Convert the parameter to a number if needed
            },
            select: {
                users_has_studies: {
                    include: {
                        users: true,
                    },
                },
            },
        });
        console.log(studyUsers, "the st");
        // Access the related users for the study
        const users = (studyUsers === null || studyUsers === void 0 ? void 0 : studyUsers.users_has_studies.map((entry) => entry.users)) || [];
        res.json({ users });
    }
    catch (error) {
        res.status(500).json({ error: 'Could not fetch study users' });
    }
});
exports.getStudyUsers = getStudyUsers;
