import  { Router,Request } from "express";
import asyncHandler from "express-async-handler";
import userController from "../controllers/user.controller";


const router = Router()


router.post("/signup",asyncHandler(userController.register))



export default router