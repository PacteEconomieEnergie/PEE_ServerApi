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
exports.StudyManagementController = void 0;
const StudyService_1 = require("../services/StudyService");
class StudyManagementController {
    constructor() {
        this.addStudy = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { clientId, userId, createdById } = req.params;
                const file = req.file; // Available thanks to multer processing the upload in the route
                const studyData = req.body; // Extract study data from request body
                if (!file) {
                    return res.status(400).json({ message: 'File is missing.' });
                }
                const newStudy = yield this.studyService.createStudy(studyData, file, clientId, userId, createdById);
                res.status(201).json(newStudy);
            }
            catch (error) {
                if (error instanceof Error) {
                    res.status(500).json({ message: error.message });
                }
                else {
                    // If the error is not an Error instance, handle it as an unknown error
                    res.status(500).json({ message: 'An unknown error occurred' });
                }
            }
        });
        this.getAllStudies = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const studies = yield this.studyService.getAllStudies();
                res.status(200).json(studies);
            }
            catch (error) {
                if (error instanceof Error) {
                    res.status(500).json({ message: error.message });
                }
                else {
                    // If the error is not an Error instance, handle it as an unknown error
                    res.status(500).json({ message: 'An unknown error occurred' });
                }
            }
        });
        this.getStudyById = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { userId } = req.params;
            try {
                const userIdInt = parseInt(userId, 10);
                if (isNaN(userIdInt)) {
                    res.status(400).json({ message: "Invalid user ID" });
                    return;
                }
                const studies = yield this.studyService.getStudiesByUserId(userIdInt);
                res.json(studies);
            }
            catch (error) {
                console.error('Error in getStudyById:', error);
                res.status(500).json({ message: 'Failed to retrieve studies for the user.' });
            }
        });
        this.uploadSyntheseFile = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const studyId = parseInt(req.params.studyId);
            if (isNaN(studyId)) {
                res.status(400).json({ message: "Invalid study ID." });
                return;
            }
            const file = req.file;
            if (!file) {
                res.status(400).json({ message: 'File is missing.' });
                return;
            }
            try {
                const { syntheseFile, updatedStudy } = yield this.studyService.uploadSyntheseFile(studyId, file);
                res.json({
                    message: 'Synthèse file uploaded successfully',
                    updatedStudy
                });
            }
            catch (error) {
                console.error('Failed to upload synthèse file:', error);
                res.status(500).json({ message: 'Internal server error', error: error });
            }
        });
        this.getEngineersStudies = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const engineersData = yield this.studyService.getEngineersStudies();
                res.json(engineersData);
            }
            catch (error) {
                console.error('Error in getEngineersStudies controller:', error);
                res.status(500).json({ message: 'Failed to retrieve engineers and their studies', error: error });
            }
        });
        this.updateStudyStatus = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { studyId } = req.params;
            const { Status } = req.body;
            // Assuming you have middleware to set userId from token
            console.log(req.body, "the body");
            try {
                const updatedStudy = yield this.studyService.updateStudyStatus(parseInt(studyId), Status);
                res.json({
                    message: 'Study status updated successfully',
                    data: updatedStudy
                });
            }
            catch (error) {
                console.error('Error updating study status:', error);
                res.status(500).json({ message: 'Failed to update study status', error: error });
            }
        });
        this.addModification = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { studyId, userId } = req.params;
            const file = req.file; // Assuming multer setup correctly adds the file
            const { TypeDeRetouche, additionalRetouch } = req.body; // Parse additionalRetouch from the request body
            try {
                const result = yield this.studyService.addModification(parseInt(studyId), file, parseInt(userId), TypeDeRetouche, parseInt(additionalRetouch) // Ensure this is a number
                );
                res.json('cretaed');
            }
            catch (error) {
                console.error('Error adding modification:', error);
                res.status(500).json({ message: 'Failed to add modification', error: error });
            }
        });
        this.studyService = new StudyService_1.StudyService();
    }
}
exports.StudyManagementController = StudyManagementController;
