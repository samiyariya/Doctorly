import doctorModel from "../models/doctorModel.js"
import sendEmail from "../services/emailService.js";
import userModel from "../models/userModel.js";

const changeAvailability = async (req, res) => {
    try {
        const { docId } = req.body;

        const doctor = await doctorModel.findById(docId);
        if (!doctor) {
            return res.status(404).json({ success: false, message: "Doctor not found" });
        }

        const previousAvailability = doctor.available;
        const newAvailability = !doctor.available;

        // Change doctor's availability
        doctor.available = newAvailability;
        await doctor.save();

        // If doctor became available, send email notifications to followers
        if (newAvailability) {
            for (let followerId of doctor.followers) {
                const user = await userModel.findById(followerId);
                if (user && user.email) {
                    await sendEmail(
                        user.email,
                        `Doctor ${doctor.name} is Now Available`,
                        `Good news! Dr. ${doctor.name} is now available for appointments.`
                    );
                }
            }
        }

        res.json({ success: true, message: `Doctor availability changed from ${previousAvailability ? 'available' : 'unavailable'} to ${newAvailability ? 'available' : 'unavailable'}` });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};


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

const doctorList = async(req, res)=>{
    try {

        // excludes password & email from the doctors response
        const doctors = await doctorModel.find({}).select(['-password', '-email'])
        res.json({success: true, doctors})
        
    } catch (error) {
        console.log(error)
        res.json({success: false, message: error.message})   
    }
}

export {changeAvailability, doctorList}












// {/*-------------------- 1 --------------------*/}

// // Command Pattern - Encapsulates request to change availability
// class ChangeAvailabilityCommand {
//     constructor(docId, doctorModel) {
//         this.docId = docId;
//         this.doctorModel = doctorModel;
//     }

//     // performs the action of changing availability  [action]
//     async execute() {
//         try {
//             const docData = await this.doctorModel.findById(this.docId);
//             await this.doctorModel.findByIdAndUpdate(this.docId, { available: !docData.available });
//             return { success: true, message: 'Availability Changed' };
//         } catch (error) {
//             console.error(error);
//             return { success: false, message: error.message };
//         }
//     }
// }

// // Factory Pattern - Creates command instances
// class CommandFactory {
//     static createChangeAvailabilityCommand(docId, doctorModel) {
//         return new ChangeAvailabilityCommand(docId, doctorModel);
//     }
// }

// // API to change doctor availability     [request]
// const changeAvailability = async (req, res) => {
//     const { docId } = req.body;
//     const command = CommandFactory.createChangeAvailabilityCommand(docId, doctorModel);
//     const result = await command.execute();
//     res.json(result);
// };



// {/*-------------------- 2 --------------------*/}

// // Strategy Pattern - Encapsulates the doctor filtering logic
// class DoctorFilterStrategy {
//     filter(doctors) {
//         return doctors.map(doc => {
//             const { password, email, ...filteredDoc } = doc.toObject();
//             return filteredDoc;
//         });
//     }
// }

// // API to get all doctors in frontend
// const doctorList = async (req, res) => {
//     try {
//         const doctors = await doctorModel.find({});
//         const strategy = new DoctorFilterStrategy();
//         const filteredDoctors = strategy.filter(doctors);
//         res.json({ success: true, doctors: filteredDoctors });

//     } catch (error) {
//         console.log(error);
//         res.json({ success: false, message: error.message });
//     }
// };








