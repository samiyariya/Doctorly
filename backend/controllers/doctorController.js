import doctorModel from "../models/doctorModel.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import appointmentModel from "../models/appointmentModel.js";


{/*-------------------- 1 --------------------*/}

// Command Pattern - Encapsulates request to change availability
class ChangeAvailabilityCommand {
    constructor(docId, doctorModel) {
        this.docId = docId;
        this.doctorModel = doctorModel;
    }

    // performs the action of changing availability  [action]
    async execute() {
        try {
            const docData = await this.doctorModel.findById(this.docId);
            await this.doctorModel.findByIdAndUpdate(this.docId, { available: !docData.available });
            return { success: true, message: 'Availability Changed' };
        } catch (error) {
            console.error(error);
            return { success: false, message: error.message };
        }
    }
}

// Factory Pattern - Creates command instances
class CommandFactory {
    static createChangeAvailabilityCommand(docId, doctorModel) {
        return new ChangeAvailabilityCommand(docId, doctorModel);
    }
}

// API to change doctor availability     [request]
const changeAvailability = async (req, res) => {
    const { docId } = req.body;
    const command = CommandFactory.createChangeAvailabilityCommand(docId, doctorModel);
    const result = await command.execute();
    res.json(result);
};



{/*-------------------- 2 --------------------*/}

// Strategy Pattern - Encapsulates the doctor filtering logic
class DoctorFilterStrategy {
    filter(doctors) {
        return doctors.map(doc => {
            const { password, email, ...filteredDoc } = doc.toObject();
            return filteredDoc;
        });
    }
}

// API to get all doctors in frontend
const doctorList = async (req, res) => {
    try {
        const doctors = await doctorModel.find({});
        const strategy = new DoctorFilterStrategy();
        const filteredDoctors = strategy.filter(doctors);
        res.json({ success: true, doctors: filteredDoctors });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};


// API for doctor login
const loginDoctor = async(req,res) => {
    try {

        const {email,password} = req.body
        const doctor = await doctorModel.findOne({email})

        if( !doctor){
            return res.json({success: false, message:'Invalid credentials'})
        }

        const isMatch = await bcrypt.compare(password, doctor.password)

        if (isMatch) {
            const token = jwt.sign({id:doctor._id},process.env.JWT_SECRET)
            res.json({success:true,token})  
        } else {
            res.json({success: false, message:'Invalid credentials'})
        }
        

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

//API to get  doctor appointments for doctor panel
const appointmentsDoctor = async (req,res) => {
    try {

        const {docId} = req.body
        const appointments = await appointmentModel.find({docId})

        res.json({ success: true, appointments})
        
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// API to mark appointment completed for doctor panel
const appointmentComplete = async (req,res) =>{
    try {

        const {docId,appointmentId} = req.body

        const appointmentData = await appointmentModel.findById(appointmentId)

        if (appointmentData && appointmentData.docId === docId) {

            await appointmentModel.findByIdAndUpdate(appointmentId, {isCompleted: true})
            return res.json({success:true,message:'Appointment Completed'})
            
        } else {
            return res.json({success:false,message:'Appointment Completion Failed'})
        }
        
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}


// API to cancel appointment completed for doctor panel
const appointmentCancel = async (req,res) =>{
    try {

        const {docId,appointmentId} = req.body

        const appointmentData = await appointmentModel.findById(appointmentId)

        if (appointmentData && appointmentData.docId === docId) {

            await appointmentModel.findByIdAndUpdate(appointmentId, {cancelled: true})
            return res.json({success:true,message:'Appointment Cancelled'})
            
        } else {
            return res.json({success:false,message:'Cancellation Failed'})
        }
        
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// API to get dashboard data for doctor panel
const doctorDashboard = async (req,res) =>{
    try {

        const{docId} =req.body

        const appointments =await appointmentModel.find({docId})

        let earnings = 0

        appointments.map((item)=>{
            if(item.isCompleted || item.payment){
                earnings += item.amount
            }
        })

        let patients = []

        appointments.map((item)=>{
            if(!patients.includes(item.userId)){
                patients.push(item.userId)
            }
        })

        const dashData = {
            earnings,
            appointments: appointments.length,
            patients: patients.length,
            latestAppointments: appointments.reverse().slice(0,5)

        }

        res.json({success:true, dashData})
        
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export {changeAvailability, doctorList, loginDoctor, appointmentsDoctor, appointmentComplete, appointmentCancel, doctorDashboard}








// API to change doctor availability
// const changeAvailability = async(req, res)=>{
//     try {

//         const {docId} = req.body

//         const docData = await doctorModel.findById(docId)
//         await doctorModel.findByIdAndUpdate(docId, {available: !docData.available})
//         res.json({success: true, message: "Availability Changed"})

//     } catch (error) {
//         console.log(error)
//         res.json({success: false, message: error.message})    
//     }
// }


// API to get all doctors in frontend
// const doctorList = async(req, res)=>{
//     try {

//         // excludes password & email from the doctors response
//         const doctors = await doctorModel.find({}).select(['-password', '-email'])
//         res.json({success: true, doctors})
        
//     } catch (error) {
//         console.log(error)
//         res.json({success: false, message: error.message})   
//     }
// }