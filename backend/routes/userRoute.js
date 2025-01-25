import express from 'express'
import { registerUser, loginUser, getProfile, updateProfile, bookAppointment, listAppointment, cancelAppointment, updatePaymentStatus, followDoctor, searchDoctorsByName } from '../controllers/userController.js'
import authUser from '../middlewares/authUser.js'
import upload from '../middlewares/multer.js'

const userRouter = express.Router()

userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.get('/get-profile', authUser, getProfile)
userRouter.post('/update-profile',upload.single('image'), authUser, updateProfile)
userRouter.post('/book-appointment', authUser, bookAppointment)
userRouter.get('/appointments', authUser, listAppointment)
userRouter.post('/cancel-appointment',authUser,cancelAppointment)
userRouter.post('/update-payment-status',authUser,updatePaymentStatus)
userRouter.post('/follow-doctor', authUser, followDoctor)
userRouter.post('/search-doctors', searchDoctorsByName)


export default userRouter