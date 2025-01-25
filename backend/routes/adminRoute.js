import express from "express";
import { addDoctor,removeDoctor,allDoctors,loginAdmin, appointmentsAdmin, appointmentCancel, adminDashboard} from "../controllers/adminController.js";
import upload from "../middlewares/multer.js";
import authAdmin from '../middlewares/authAdmin.js';
import { changeAvailability } from "../controllers/doctorController.js";

const adminRouter = express.Router()

// adding authAdmin middleware so that only admin can add doctor
adminRouter.post('/add-doctor', authAdmin, upload.single('image'), addDoctor)
adminRouter.post('/remove-doctor', authAdmin, removeDoctor)
adminRouter.post('/login', loginAdmin)
adminRouter.post('/all-doctors', authAdmin, allDoctors)   // using authAdmin middleware
adminRouter.post('/change-availability', authAdmin, changeAvailability)
adminRouter.get('/appointments', authAdmin, appointmentsAdmin)
adminRouter.post('/cancel-appointment',authAdmin, appointmentCancel)
adminRouter.get('/dashboard', authAdmin, adminDashboard)
export default adminRouter