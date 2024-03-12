import express from "express"
import { addUser,getAllUsers, login,getUserByEmail,getUserById,getAllEngineers,updatePassword, resetPassword,verifyResetCode, setNewPassword } from "../controller/userControllers"
import { userValidationRules,loginValidationRules,validate } from "../middleware/userValidatore"
import { uploadAvatar } from "../controller/uploadAvatar"
import { uploadFile } from "../middleware/multerSetup"
const router=express.Router()

router.post("/add",userValidationRules(),validate,addUser)
router.post("/login",loginValidationRules(),validate,login)
router.get('/',getAllUsers)
router.get('/email/:Email', getUserByEmail);
router.get('/id/:id', getUserById);
router.get("/engineers",getAllEngineers)
router.post("/updatePassword/:userId",updatePassword)  
router.post('/avatar/:id', uploadFile('avatar'), uploadAvatar);
router.post("/resetPassword",resetPassword)
router.post("/verifyResetCode",verifyResetCode)
router.post("/setNewPassword",setNewPassword)
  



export default router;