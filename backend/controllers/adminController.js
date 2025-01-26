import validator from "validator"
import bcrypt from "bcrypt"
import { v2 as cloudinary } from "cloudinary"
import doctorModel from "../models/doctorModel.js"
import jwt from "jsonwebtoken"
import appointmentModel from "../models/appointmentModel.js"
import userModel from "../models/userModel.js"


// API for admin login
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



// API to remove a doctor
const removeDoctor = async (req, res) => {
    try {
      const { docId } = req.body;
  
      if (!docId) {
        return res.json({ success: false, message: "Doctor ID is required" });
      }
  
      const deletedDoctor = await doctorModel.findByIdAndDelete(docId);
  
      if (!deletedDoctor) {
        return res.json({ success: false, message: "Doctor not found" });
      }
  
      res.json({ success: true, message: "Doctor removed successfully" });
    } catch (error) {
      console.log(error);
      res.json({ success: false, message: error.message });
    }
  }  
  


// API to get all doctors list for admin panel
const allDoctors = async(req, res) => {
    try {
        const doctors = await doctorModel.find({}).select('-password')
        res.json({success: true, doctors})
        

    } catch (error) {
        console.log(error)
        res.json({success: false, message: error.message})    
    }
}


//API to get all appointments list
const appointmentsAdmin = async (req, res) => {
    try {

        const appointments = await appointmentModel.find({})
        res.json({ success: true, appointments })
        
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}


//API to get Dashboard data for admin panel
const adminDashboard = async (req, res) => {
    try {

        const doctors = await doctorModel.find({})
        const users = await userModel.find({})
        const appointments = await appointmentModel.find({})

        const dashData = {
            doctors:doctors.length,
            appointments: appointments.length,
            patients: users.length,
            latestAppointments: appointments.reverse().slice(0,5)
        }

        res.json({success:true,dashData})
        
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })  
    }
}


//API for Appointment cancellation
const appointmentCancel = async (req, res) => {
    try {

        const {appointmentId} = req.body

        const appointmentData = await appointmentModel.findById(appointmentId)


        await appointmentModel.findByIdAndUpdate(appointmentId, {cancelled:true})

        //releasing doctor slot
        const {docId, slotDate, slotTime} = appointmentData
        const doctorData = await doctorModel.findById(docId)

        let slots_booked = doctorData.slots_booked
        slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime)
        
        await doctorModel.findByIdAndUpdate(docId, {slots_booked})

        res.json({success:true, message:'Appointment Cancelled'})

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export {addDoctor, loginAdmin, allDoctors, appointmentsAdmin, appointmentCancel,adminDashboard, removeDoctor}




// //-------------------- 1 --------------------

// // Factory Pattern - Handles doctor creation and encapsulates object construction
// class DoctorFactory {
//     static async createDoctor(data, imageFile) {
//         const { name, email, password, speciality, degree, experience, about, fees, address } = data;

//         // Validate required fields
//         if (!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address) {
//             throw new Error('Missing Details');
//         }

//         // Validate email format
//         if (!validator.isEmail(email)) {
//             throw new Error('Please enter a valid email');
//         }

//         // Validate password strength
//         if (password.length < 8) {
//             throw new Error('Please enter a strong password');
//         }

//         // Hash password
//         const salt = await bcrypt.genSalt(10);
//         const hashedPassword = await bcrypt.hash(password, salt);

//         // Upload image to cloudinary
//         const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: 'image' });
//         const imageUrl = imageUpload.secure_url;

//         // Create doctor object
//         return new doctorModel({
//             name,
//             email,
//             image: imageUrl,
//             password: hashedPassword,
//             speciality,
//             degree,
//             experience,
//             about,
//             fees,
//             address: JSON.parse(address),
//             date: Date.now()
//         });
//     }
// }

// // API for adding doctor
// const addDoctor = async (req, res) => {
//     try {
//         const newDoctor = await DoctorFactory.createDoctor(req.body, req.file);
//         await newDoctor.save();
//         res.json({ success: true, message: 'Doctor added successfully' });
//     } catch (error) {
//         console.log(error);
//         res.json({ success: false, message: error.message });
//     }
// };




// // -------------------- 2 --------------------

// // Singleton Pattern - Ensures only one instance of admin credentials validation
// class AdminAuthenticator {
//     constructor() {
//         if (!AdminAuthenticator.instance) {
//             AdminAuthenticator.instance = this;
//         }
//         return AdminAuthenticator.instance;
//     }

//     authenticate(email, password) {
//         return email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD;
//     }
// }

// // API for admin login
// const loginAdmin = async (req, res) => {
//     try {
//         const { email, password } = req.body;
//         const authenticator = new AdminAuthenticator();

//         if (authenticator.authenticate(email, password)) {
//             const token = jwt.sign(email + password, process.env.JWT_SECRET);
//             res.json({ success: true, token });
//         } else {
//             res.json({ success: false, message: 'Invalid Credentials' });
//         }
//     } catch (error) {
//         console.log(error);
//         res.json({ success: false, message: error.message });
//     }
// };




// // -------------------- 3 --------------------

// // Decorator Pattern - Adds filtering behavior to the doctor query
// class DoctorFilterDecorator {
//     constructor(doctorQuery) {
//         this.doctorQuery = doctorQuery;
//     }

//     async execute() {
//         return await this.doctorQuery.select('-password');
//     }
// }

// // API to get all doctors list for admin panel
// const allDoctors = async (req, res) => {
//     try {
//         const doctorQuery = doctorModel.find({});
//         const filteredDoctors = new DoctorFilterDecorator(doctorQuery);
//         const doctors = await filteredDoctors.execute();
//         res.json({ success: true, doctors });

//     } catch (error) {
//         console.log(error);
//         res.json({ success: false, message: error.message });
//     }
// };