// src/routes/studyRoutes.ts

import express from 'express';
import { StudyManagementController } from '../controller/studyControllers';
import { uploadFile } from '../middleware/multerSetup'; // Adjusted import path as needed

const router = express.Router();
const studyController = new StudyManagementController();

// Applying the file upload middleware to routes that require file processing
router.post('/add/:clientId/:userId/:createdById', uploadFile, studyController.addStudy);
// router.post('/:studyId/uploadSyntheseFile', uploadFile, (req, res) => studyController.uploadSyntheseFile(req, res));

// Other routes do not need file processing, so they are not using the uploadFile middleware
// router.put('/modify/:IdStudies/:UserID', (req, res) => studyController.addModification(req, res));
router.get("/", studyController.getAllStudies);
router.get('/engineers', studyController.getEngineersStudies);
router.get('/:userId', studyController.getStudyById);
router.patch("/:studyId",  uploadFile,studyController.uploadSyntheseFile);
router.patch('/:studyId/status',studyController.updateStudyStatus)
router.post('/:studyId/:userId', uploadFile, studyController.addModification);
export default router;
