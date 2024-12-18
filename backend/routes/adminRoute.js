import express from "express";
import { addDoctor,allDoctors,loginAdmin} from "../controllers/adminController.js";
import upload from "../middlewares/multer.js";
import authAdmin from '../middlewares/authAdmin.js';
import { changeAvailability } from "../controllers/doctorController.js";

const adminRouter = express.Router()

// adding authAdmin middleware so that only admin can add doctor
adminRouter.post('/add-doctor', authAdmin, upload.single('image'), addDoctor)
adminRouter.post('/login', loginAdmin)
adminRouter.post('/all-doctors', authAdmin, allDoctors)   // using authAdmin middleware
adminRouter.post('/change-availability', authAdmin, changeAvailability)

export default adminRouter