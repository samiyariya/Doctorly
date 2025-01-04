import doctorModel from "../models/doctorModel.js"


{/*-------------------- 1 --------------------*/}

// Command Pattern - Encapsulates request to change availability
class ChangeAvailabilityCommand {
    constructor(docId, doctorModel) {
        this.docId = docId;
        this.doctorModel = doctorModel;
    }

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

// API to change doctor availability
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


export {changeAvailability, doctorList}








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