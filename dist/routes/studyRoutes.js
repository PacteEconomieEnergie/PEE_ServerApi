"use strict";
// src/routes/studyRoutes.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const studyControllers_1 = require("../controller/studyControllers");
const multerSetup_1 = require("../middleware/multerSetup"); // Adjusted import path as needed
const router = express_1.default.Router();
const studyController = new studyControllers_1.StudyManagementController();
// Applying the file upload middleware to routes that require file processing
router.post('/add/:clientId/:userId/:createdById', multerSetup_1.uploadFile, studyController.addStudy);
// router.post('/:studyId/uploadSyntheseFile', uploadFile, (req, res) => studyController.uploadSyntheseFile(req, res));
// Other routes do not need file processing, so they are not using the uploadFile middleware
// router.put('/modify/:IdStudies/:UserID', (req, res) => studyController.addModification(req, res));
router.get("/", studyController.getAllStudies);
router.get('/engineers', studyController.getEngineersStudies);
router.get('/:userId', studyController.getStudyById);
router.patch("/:studyId", multerSetup_1.uploadFile, studyController.uploadSyntheseFile);
router.patch('/:studyId/status', studyController.updateStudyStatus);
router.post('/:studyId/:userId', multerSetup_1.uploadFile, studyController.addModification);
exports.default = router;
