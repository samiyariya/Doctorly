import express from "express";
import { addDoctor,loginAdmin } from "../controllers/adminController.js";
import upload from "../middlewares/multer.js";
import authAdmin from '../middlewares/authAdmin.js';

const adminRouter = express.Router()

// adding authAdmin middleware so that only admin can add doctor
adminRouter.post('/add-doctor', authAdmin, upload.single('image'), addDoctor)
adminRouter.post('/login', loginAdmin)

export default adminRouter