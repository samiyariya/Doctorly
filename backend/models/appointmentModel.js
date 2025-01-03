import mongoose from "mongoose";

// Singleton pattern + Factory pattern

class AppointmentSchemaFactory {
    static createSchema() {
        return new mongoose.Schema({
            userId: { type: String, required: true },
            docId: { type: String, required: true },
            slotDate: { type: String, required: true },
            slotTime: { type: String, required: true },
            userData: { type: Object, required: true },
            docData: { type: Object, required: true },
            amount: { type: Number, required: true },
            date: { type: Number, required: true },
            cancelled: { type: Boolean, default: false },
            payment: { type: Boolean, default: false },
            isCompleted: { type: Boolean, default: false }
        });
    }
}

class AppointmentModelFactory {
    static instance = null;

    static getAppointmentModel() {
        if (!AppointmentModelFactory.instance) {
            const schema = AppointmentSchemaFactory.createSchema();
            AppointmentModelFactory.instance = mongoose.models.appointment || mongoose.model('appointment', schema);
            console.log("Appointment model created (Singleton instance)");
        } else {
            console.log("Reusing existing appointment model (Singleton)");
        }
        return AppointmentModelFactory.instance;
    }
}

const appointmentModel = AppointmentModelFactory.getAppointmentModel();
export default appointmentModel;






// import mongoose from "mongoose";

// const appointmentScheme = new mongoose.Schema({
//     userId: {type: String, required: true},
//     docId: {type: String, required: true},
//     slotDate: {type: String, required: true},
//     slotTime: {type: String, required: true},
//     userData: {type: Object, required: true},
//     docData: {type: Object, required: true},
//     amount: {type: Number, required: true},
//     date: {type: Number, required: true},
//     cancelled: {type: Boolean, default: false},
//     payment: {type: Boolean, default: false},
//     isCompleted: {type: Boolean, default: false},
// })      

// const appointmentModel = mongoose.models.appointment || mongoose.model('appointment', appointmentScheme)

// export default appointmentModel