import express from "express"
import { LeadsControllers } from "../controller/leadControllers"
import { uploadFile } from "../middleware/multerSetup"
const router=express.Router()
const leadControllers=new LeadsControllers()
router.post("/",uploadFile('pdfFile'),leadControllers.createLead)
router.get('/',leadControllers.getAllLeads)
router.get('/:id',leadControllers.getLeadById)
router.get('/email/:email',leadControllers.getLeadByEmail)

export default router