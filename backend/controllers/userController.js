import validator from 'validator'
import bcrypt from 'bcrypt'
import userModel from '../models/userModel.js'
import jwt from 'jsonwebtoken'
import { v2 as cloudinary } from "cloudinary"
import doctorModel from '../models/doctorModel.js' 
import appointmentModel from '../models/appointmentModel.js'

// API to register user 
const registerUser = async(req, res) => {
    try {
        const {name, email, password} = req.body
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

        // checking for all data
        if(!name || !email || !password){
            return res.json({succcess: false, message: "Missing Details"})
        } 

        // validating email format
        if(!validator.isEmail(email)){ 
            return res.json({succcess: false, message: "Please enter a valid email"})
        }

        // Validating strong password

        if (!passwordRegex.test(password)) {
            return res.json({ success: false, message: "Password must be at least 8 characters long and include uppercase, lowercase, digits, and special characters" });
        }

        // hashing user password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        // data format
        const userData = {
            name,
            email,
            password: hashedPassword,
        }

        // adding doctor to database
        const newUser = new userModel(userData)
        const user = await newUser.save()

        // creating token so that user can login
        const token = jwt.sign({id:user._id}, process.env.JWT_SECRET)

        res.json({success: true, token})

        
    } catch (error) {
        console.log(error)
        res.json({success: false, message: error.message})    
    }
}


// API for user login
const loginUser = async(req, res) => {
    try {

        const {email, password} = req.body
        const user = await userModel.findOne({email})

        if(!user){
            return res.json({success: false, message: "User does not exist"})
        }

        // if user exists, check if the password is correct
        const isMatch = await bcrypt.compare(password, user.password)

        if(isMatch){
            // creating token so that user can login
            const token = jwt.sign({id:user._id}, process.env.JWT_SECRET)
            res.json({success: true, token})
        } else {
            res.json({success: false, message: "Invalid credentials"})
        }

    } catch (error) {
        console.log(error)
        res.json({success: false, message: error.message})   
    }

}



// API to get user profile data
const getProfile = async(req, res) => {
    try {

        const { userId } = req.body
        const userData = await userModel.findById(userId).select('-password')
         
        res.json({success: true, userData})
        
    } catch (error) {
        console.log(error)
        res.json({success: false, message: error.message})    
    }
}


const updateProfile = async(req, res) => {
    try {

        const {userId, name, phone, address, dob, gender} = req.body
        const imageFile = req.file

        if(!name || !phone || !address || !dob || !gender){
            return res.json({succcess: false, message: "Missing Details"})
        }

        await userModel.findByIdAndUpdate(userId, {name, phone, address: JSON.parse(address), dob, gender})
        
        if(imageFile){
            // uploading image to cloudinary
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, {resource_type: "image"})
            const imageUrl = imageUpload.secure_url

            await userModel.findByIdAndUpdate(userId, {image: imageUrl})

            res.json({success: true, message: "Profile Updated"})
        }


    } catch (error) {
        console.log(error)
        res.json({success: false, message: error.message})    
    }
}


// API to book appointment
const bookAppointment = async(req, res) => {
    try {
        const {userId, docId, slotDate, slotTime} = req.body

        // finding the doctor
        const docData = await doctorModel.findById(docId).select('-password')

        if(!docData.available){            // if doctor is not found, print not available
            return res.json({success: false, message: "Doctor is not available"})
        } 

        // if doct available, getting the slots booked data
        let slots_booked = docData.slots_booked

        // checking for slot availability
        if(slots_booked[slotDate]) {
            // checking if slot is available for a certain date & time
            if(slots_booked[slotDate].includes(slotTime)){
                return res.json({success: false, message: "Slot not available"})
            } else {
                slots_booked[slotDate].push(slotTime)        // booking the slot
            }
        } else {
            slots_booked[slotDate] = []
            slots_booked[slotDate].push(slotTime)
        }
        
        const userData = await userModel.findById(userId).select('-password')

        delete docData.slots_booked  // we don't want to store slots booked after booking an appointment, so delete it

        const appointmentData = {         // creating appointment data
            userId,
            docId,
            userData,
            docData,
            amount: docData.fees,
            slotTime,
            slotDate,
            date: Date.now()
        }

        const newAppointment = new appointmentModel(appointmentData)
        await newAppointment.save()

        // save new slots data in docData
        await doctorModel.findByIdAndUpdate(docId, {slots_booked})

        res.json({success: true, message: "Appointment Booked"})


    } catch (error) {
        console.log(error)
        res.json({success: false, message: error.message})
    }
}
export {registerUser, loginUser, getProfile, updateProfile, bookAppointment}