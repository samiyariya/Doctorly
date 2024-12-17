import validator from "validator"
import bcrypt from "bcrypt"
import { v2 as cloudinary } from "cloudinary"
import doctorModel from "../models/doctorModel.js"
import jwt from "jsonwebtoken"

// API for adding doctor
const addDoctor = async (req, res) => {
    try {
        // extracts data from the request body
        const {name, email, password, speciality, degree, experience, about, fees, address} = req.body
        const imageFile = req.file

        // checking for all data to add doctor
        if(!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address){
            return res.json({succcess: false, message: "Missing Details"})
        } 

        // validating email format
        if(!validator.isEmail(email)){ 
            return res.json({succcess: false, message: "Please enter a valid email"})
        }

        // validating strong password
        if(password.length < 8){
            return res.json({succcess: false, message: "Please enter a strong password"})
        }

        // hashing doctor password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        // uploading image to cloudinary
        const imageUpload = await cloudinary.uploader.upload(imageFile.path, {resource_type: "image"})
        const imageUrl = imageUpload.secure_url

        // data format
        const doctorData = {
            name,
            email,
            image: imageUrl,
            password: hashedPassword,
            speciality,
            degree,
            experience,
            about,
            fees,
            address: JSON.parse(address),
            date: Date.now()
        }

        // adding doctor to database
        const newDoctor = new doctorModel(doctorData)
        await newDoctor.save()

        res.json({success: true, message: "Doctor added successfully"})

    } catch (error) {
        console.log(error)
        res.json({success: false, message: error.message})    
    }
}


// api for admin login
const loginAdmin = async(req, res) => {
    try {

        const {email, password} = req.body

        // checking if the email and password are correct
        if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD){

            // generating token & sending as response
            const token = jwt.sign(email+password, process.env.JWT_SECRET)
            res.json({success:true, token})

        } else {
            res.json({success: false, message: "Invalid Credentials"})
        }
        
    } catch (error) {
        console.log(error)
        res.json({success: false, message: error.message})   
    }

}


// API to get all doctors list for admin panel
const allDoctors = async(req, res) => {
    try {
        
        // excludes password from the doctors response
        const doctors = await doctorModel.find({}).select('-password')
        res.json({success: true, doctors})
        

    } catch (error) {
        console.log(error)
        res.json({success: false, message: error.message})    
    }
}

export {addDoctor, loginAdmin, allDoctors}