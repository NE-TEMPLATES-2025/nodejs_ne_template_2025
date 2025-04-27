import express, { Router } from "express";
import authController from "../controllers/auth.controller";
import { checkAuth } from "../middlewares/auth.middleware";

const router:Router = express.Router()


router.post("/signin",authController.login)
router.put("/initiate-account-verification",authController.initiateAccountVerification)
router.put("/verify-account",authController.verifyAccount)
router.put("/initiate-password-reset",authController.initiateResetPassword)
router.put("/reset-password",authController.resetPassword)

export default router