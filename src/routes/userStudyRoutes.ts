import express from 'express'
import {getUserStudies,getStudyUsers} from "../controller/userStudyController"


const router =express.Router()

router.get("/users/:userId",getUserStudies)
router.get("/studies/:studyId",getStudyUsers)



export default router;  