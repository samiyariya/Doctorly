import mongoose from "mongoose";

// Singleton pattern + Factory pattern

// Factory for creating doctor schemas
class DoctorSchemaFactory {
    static createDoctorSchema() {
        return new mongoose.Schema({
            name: { type: String, required: true },
            email: { type: String, required: true, unique: true },
            password: { type: String, required: true },
            image: { type: String, required: true },
            speciality: { type: String, required: true },
            degree: { type: String, required: true },
            experience: { type: String, required: true },
            about: { type: String, required: true },
            available: { type: Boolean, default: true },
            fees: { type: Number, required: true },
            address: { type: Object, required: true },
            date: { type: Number, required: true },
            slots_booked: { type: Object, default: {} },
            followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]  // List of users following the doctor
        }, { minimize: false });  // Ensure empty objects are saved
    }
}

// Singleton Factory for creating doctor models
class DoctorModelFactory {
    static instance = null;  // Singleton instance

    static getDoctorModel() {
        if (!DoctorModelFactory.instance) {
            const schema = DoctorSchemaFactory.createDoctorSchema();
            DoctorModelFactory.instance = mongoose.models.doctor || mongoose.model('doctor', schema);
            console.log("Doctor model created (Singleton instance)");
        } else {
            console.log("Reusing existing doctor model (Singleton)");
        }
        return DoctorModelFactory.instance;
    }
}

// Get doctor model through factory
const doctorModel = DoctorModelFactory.getDoctorModel();
export default doctorModel;






// import mongoose from "mongoose";

// const doctorScheme = new mongoose.Schema({
//     name: {type: String, required: true},
//     email: {type: String, required: true, unique: true},
//     password: {type: String, required: true},
//     image: {type: String, required: true},
//     speciality: {type: String, required: true},
//     degree: {type: String, required: true},
//     experience: {type: String, required: true},
//     about: {type: String, required: true},
//     available: {type: Boolean, default: true},
//     fees: {type: Number, required: true},
//     address: {type: Object, required: true},
//     date: {type: Number, required: true},
//     slots_booked: {type: Object, default: {}}    //in empty object we'll store doctor appointment data to know when the doctor is available or not
// },{minimize:false})     //it's required to store empty object

// const doctorModel = mongoose.models.doctor || mongoose.model('doctor', doctorScheme)

// export default doctorModel