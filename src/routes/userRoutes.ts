import express from "express"
import { addUser,getAllUsers, login,getUserByEmail,getUserById,getAllEngineers } from "../controller/userControllers"
import { userValidationRules,loginValidationRules,validate } from "../middelware/userValidatore"

const router=express.Router()

router.post("/add",userValidationRules(),validate,addUser)
router.post("/login",loginValidationRules(),validate,login)
router.get('/',getAllUsers)
router.get('/email/:Email', getUserByEmail);
router.get('/id/:id', getUserById);
router.get("/engineers",getAllEngineers)




module.exports=router