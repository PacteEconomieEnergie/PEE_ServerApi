import express from 'express'
import { addModification, addStudy, getAllStudies } from '../controller/studyControllers'

const router=express.Router()

router.post('/add/:clientId/:userId',addStudy)
router.put('/add/:IdStudies/:UserID',addModification)
router.get("/",getAllStudies)



module.exports=router