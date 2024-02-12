import express from 'express'
import { addModification, addStudy, getAllStudies,getStudyById,updatedStudyStatus,uploadSyntheseFile } from '../controller/studyControllers'

const router=express.Router()

router.post('/add/:clientId/:userId/:createdById',addStudy)
router.put('/add/:IdStudies/:UserID',addModification)
router.get("/",getAllStudies)
router.get("/:userId",getStudyById)
router.patch("/:studyId",updatedStudyStatus)
router.post('/:studyId/uploadSyntheseFile',uploadSyntheseFile)



export default router;