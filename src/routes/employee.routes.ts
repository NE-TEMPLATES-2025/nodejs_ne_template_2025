import {Router} from 'express'
import asyncHandler from "express-async-handler"
import employeeController from "../controllers/employee.controller"
import { checkAuth } from '../middlewares/auth.middleware';


const router= Router();

// Passing auth middleware
router.use(checkAuth)

router.post("/create",asyncHandler(employeeController.createEmployee))
router.get("/all",asyncHandler(employeeController.getAllEmployees))
router.get("/search",asyncHandler(employeeController.searchEmployees))

export default router