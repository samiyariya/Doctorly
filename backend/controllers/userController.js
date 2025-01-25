import validator from "validator";
import bcrypt from "bcrypt";
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";
import sendEmail from "../services/emailService.js";

// API to register user
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    // checking for all data
    if (!name || !email || !password) {
      return res.json({ succcess: false, message: "Missing Details" });
    }

    // validating email format
    if (!validator.isEmail(email)) {
      return res.json({
        succcess: false,
        message: "Please enter a valid email",
      });
    }

    // Validating strong password

    if (!passwordRegex.test(password)) {
      return res.json({
        success: false,
        message:
          "Password must be at least 8 characters long and include uppercase, lowercase, digits, and special characters",
      });
    }

    // hashing user password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // data format
    const userData = {
      name,
      email,
      password: hashedPassword,
    };

    // adding doctor to database
    const newUser = new userModel(userData);
    const user = await newUser.save();

    // creating token so that user can login
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API for user login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User does not exist" });
    }

    // if user exists, check if the password is correct
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      // creating token so that user can login
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to get user profile data
const getProfile = async (req, res) => {
  try {
    const { userId } = req.body;
    const userData = await userModel.findById(userId).select("-password");

    res.json({ success: true, userData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to update user profile
const updateProfile = async (req, res) => {
  try {
    const { userId, name, phone, address, dob, gender } = req.body;
    const imageFile = req.file;

    if (!name || !phone || !address || !dob || !gender) {
      return res.json({ succcess: false, message: "Missing Details" });
    }

    await userModel.findByIdAndUpdate(userId, {
      name,
      phone,
      address: JSON.parse(address),
      dob,
      gender,
    });

    if (imageFile) {
      // uploading image to cloudinary
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image",
      });
      const imageUrl = imageUpload.secure_url;

      await userModel.findByIdAndUpdate(userId, { image: imageUrl });

      res.json({ success: true, message: "Profile Updated" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to book an appointment
const bookAppointment = async (req, res) => {
  try {
    const { userId, docId, slotDate, slotTime } = req.body;

    const docData = await doctorModel.findById(docId).select("-password");
    if (!docData.available) {
      return res.json({ success: false, message: "Doctor is not available" });
    }

    let slots_booked = docData.slots_booked;
    if (slots_booked[slotDate]?.includes(slotTime)) {
      return res.json({ success: false, message: "Slot not available" });
    } else {
      slots_booked[slotDate] = slots_booked[slotDate] || [];
      slots_booked[slotDate].push(slotTime);
    }

    const userData = await userModel.findById(userId).select("-password");
    const appointmentData = {
      userId,
      docId,
      userData,
      docData,
      amount: docData.fees,
      slotTime,
      slotDate,
      date: Date.now(),
    };

    const newAppointment = new appointmentModel(appointmentData);
    await newAppointment.save();
    await doctorModel.findByIdAndUpdate(docId, { slots_booked });

    // Send email confirmation
    const emailText = `
            Hello ${userData.name},
            
            Your appointment with Dr. ${docData.name} is confirmed.
            
            Details:
            Doctor: Dr. ${docData.name}
            Date: ${slotDate}
            Time: ${slotTime}
            Amount: $${docData.fees}
            
            Thank you for choosing our service.
        `;

    await sendEmail(userData.email, "Appointment Confirmation", emailText);

    res.json({ success: true, message: "Appointment Booked and Email Sent" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to follow a doctor
const followDoctor = async (req, res) => {
  try {
    console.log("Request body:", req.body);
    const { docId } = req.body;
    const userId = req.body.userId; // Accessing userId from req.body

    // Check if the user is already following the doctor
    const doctor = await doctorModel.findById(docId);
    if (!doctor) {
      return res
        .status(404)
        .json({ success: false, message: "Doctor not found" });
    }

    if (doctor.followers.includes(userId)) {
      return res
        .status(400)
        .json({ success: false, message: "Already following this doctor" });
    }

    // Add user to the doctor's followers list
    doctor.followers.push(userId);
    await doctor.save();

    res.json({ success: true, message: "Successfully followed the doctor" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// API to get user appointments for frontend my-appointments page
const listAppointment = async (req, res) => {
  try {
    const { userId } = req.body;
    const appointments = await appointmentModel.find({ userId });

    res.json({ success: true, appointments });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to cancel appointment
const cancelAppointment = async (req, res) => {
  try {
    const { userId, appointmentId } = req.body;

    const appointmentData = await appointmentModel.findById(appointmentId);

    //verify appointment user
    if (appointmentData.userId !== userId) {
      return res.json({ success: false, message: "Unauthorized action" });
    }

    await appointmentModel.findByIdAndUpdate(appointmentId, {
      cancelled: true,
    });

    //releasing doctor slot
    const { docId, slotDate, slotTime } = appointmentData;
    const doctorData = await doctorModel.findById(docId);

    let slots_booked = doctorData.slots_booked;
    slots_booked[slotDate] = slots_booked[slotDate].filter(
      (e) => e !== slotTime
    );

    await doctorModel.findByIdAndUpdate(docId, { slots_booked });

    res.json({ success: true, message: "Appointment Cancelled" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to update payment status
const updatePaymentStatus = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    const appointment = await appointmentModel.findById(appointmentId);
    if (!appointment) {
      return res.json({ success: false, message: "Appointment not found" });
    }

    appointment.payment = true; // Mark as paid
    await appointment.save();

    res.json({ success: true, message: "Payment status updated successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to search for doctors by name
const searchDoctorsByName = async (req, res) => {
  try {
    const { name } = req.body; // Name entered by the user

    if (!name) {
      return res.json({
        success: false,
        message: "Please provide a name to search for",
      });
    }

    // Split the search name into words (based on spaces)
    const words = name.trim().split(/\s+/);

    // Create a regex pattern that searches for all words in the name
    const regexPattern = words.map((word) => `(?:\\b${word}\\b)`).join("|"); // Use word boundaries to match complete words

    // Search for doctors whose name matches the regex pattern
    const doctors = await doctorModel.find({
      name: { $regex: regexPattern, $options: "i" }, // Case-insensitive match
    });

    if (doctors.length === 0) {
      return res.json({
        success: false,
        message: "No doctors found with that name",
      });
    }

    res.json({ success: true, doctors });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// const suggestSpecialist = async (req, res) => {
//     try {
//         const { description } = req.body; // User's health description

//         if (!description) {
//             return res.json({ success: false, message: "Please provide a health description" });
//         }

//         // Define symptom-to-specialist mapping
//         const symptomToSpecialistMap = {
//             // Dermatologist
//             skin: "Dermatologist",
//             rash: "Dermatologist",
//             acne: "Dermatologist",
//             eczema: "Dermatologist",
//             psoriasis: "Dermatologist",
//             itching: "Dermatologist",
//             dryness: "Dermatologist",
//             pigmentation: "Dermatologist",
//             hair: "Dermatologist",
//             nails: "Dermatologist",

//             // Neurologist
//             headache: "Neurologist",
//             dizziness: "Neurologist",
//             migraine: "Neurologist",
//             seizure: "Neurologist",
//             epilepsy: "Neurologist",
//             memory: "Neurologist",
//             confusion: "Neurologist",
//             numbness: "Neurologist",
//             stroke: "Neurologist",
//             tremor: "Neurologist",
//             paralysis: "Neurologist",

//             // Gastroenterologist
//             stomach: "Gastroenterologist",
//             diarrhea: "Gastroenterologist",
//             constipation: "Gastroenterologist",
//             bloating: "Gastroenterologist",
//             nausea: "Gastroenterologist",
//             vomiting: "Gastroenterologist",
//             heartburn: "Gastroenterologist",
//             indigestion: "Gastroenterologist",
//             ulcer: "Gastroenterologist",
//             liver: "Gastroenterologist",
//             pancreas: "Gastroenterologist",
//             acid: "Gastroenterologist",
//             bowel: "Gastroenterologist",
//             colon: "Gastroenterologist",

//             // Pediatrician
//             child: "Pediatrician",
//             baby: "Pediatrician",
//             infant: "Pediatrician",
//             toddler: "Pediatrician",
//             "child   vaccination" : "Pediatrician",
//             "child growth" : "Pediatrician",
//             feeding: "Pediatrician",
//             teething: "Pediatrician",
//             developmental: "Pediatrician",
//             fever: "Pediatrician", // Fever in children
//             cold: "Pediatrician", // Cold in children
//             flu: "Pediatrician", // Flu in children

//             // Gynecologist
//             pregnancy: "Gynecologist",
//             menstruation: "Gynecologist",
//             period: "Gynecologist",
//             menopause: "Gynecologist",
//             fertility: "Gynecologist",
//             conception: "Gynecologist",
//             contraception: "Gynecologist",
//             uterus: "Gynecologist",
//             ovary: "Gynecologist",
//             vaginal: "Gynecologist",
//             pelvic: "Gynecologist",
//             cramps: "Gynecologist",
//             discharge: "Gynecologist",

//             // General Physician
//             fever: "General Physician", // General fever
//             cold: "General Physician", // General cold
//             cough: "General Physician",
//             flu: "General Physician",
//             fatigue: "General Physician",
//             weakness: "General Physician",
//             bodyache: "General Physician",
//             infection: "General Physician",
//             sore: "General Physician",
//             throat: "General Physician",
//             temperature: "General Physician",
//             pain: "General Physician", // Generic pain
//         };

//         // Analyze the description
//         const keywords = Object.keys(symptomToSpecialistMap);
//         const matchedSpecialists = new Set();

//         for (const keyword of keywords) {
//             if (description.toLowerCase().includes(keyword)) {
//                 matchedSpecialists.add(symptomToSpecialistMap[keyword]);
//             }
//         }

//         // Convert the matched specialists set to an array
//         const specialistsArray = Array.from(matchedSpecialists);

//         // Return the matched specialists
//         res.json({
//             success: true,
//             specialists: specialistsArray,
//             message: `Based on your description, you may visit the following specialists: ${specialistsArray.join(", ")}.`,
//         });
//     } catch (error) {
//         console.log(error);
//         res.json({ success: false, message: error.message });
//     }
// };

// API to suggest a specialist by symptoms

const suggestSpecialist = async (req, res) => {
  try {
    const { description } = req.body; // User's health description

    if (!description) {
      return res.json({
        success: false,
        message: "Please provide a health description",
      });
    }

    
    const symptomToSpecialistMap = {
        // Dermatologist
        "skin": { specialist: "Dermatologist", priority: 3 },
        "face": { specialist: "Dermatologist", priority: 3 },
        "hair": { specialist: "Dermatologist", priority: 3 },
        "nails": { specialist: "Dermatologist", priority: 3 },
        "rash": { specialist: "Dermatologist", priority: 2 },
        "red rash": { specialist: "Dermatologist", priority: 2 },
        "itchy skin": { specialist: "Dermatologist", priority: 2 },
        "dry skin": { specialist: "Dermatologist", priority: 3 },
        "pigmentation": { specialist: "Dermatologist", priority: 3 },
        "hair fall": { specialist: "Dermatologist", priority: 3 },
        "nail problems": { specialist: "Dermatologist", priority: 3 },
        eczema: { specialist: "Dermatologist", priority: 2 },
        acne: { specialist: "Dermatologist", priority: 2 },
        psoriasis: { specialist: "Dermatologist", priority: 2 },
        itching: { specialist: "Dermatologist", priority: 2 },
    
        // Neurologist
        "headache": { specialist: "Neurologist", priority: 2 },
        "severe headache": { specialist: "Neurologist", priority: 1 },
        "migraine pain": { specialist: "Neurologist", priority: 1 },
        "chronic headache": { specialist: "Neurologist", priority: 1 },
        "dizziness": { specialist: "Neurologist", priority: 1 },
        "loss of memory": { specialist: "Neurologist", priority: 1 },
        "stroke": { specialist: "Neurologist", priority: 1 },
        "tremors": { specialist: "Neurologist", priority: 2 },
        paralysis: { specialist: "Neurologist", priority: 1 },
        numbness: { specialist: "Neurologist", priority: 2 },
        seizure: { specialist: "Neurologist", priority: 1 },
        epilepsy: { specialist: "Neurologist", priority: 1 },
    
        // Gastroenterologist
        "stomach": { specialist: "Gastroenterologist", priority: 2 },
        "diarhea": { specialist: "Gastroenterologist", priority: 2 },
        "abdominal pain": { specialist: "Gastroenterologist", priority: 2 },
        "acidity": { specialist: "Gastroenterologist", priority: 2 },
        "severe stomach pain": { specialist: "Gastroenterologist", priority: 1 },
        "chronic diarrhea": { specialist: "Gastroenterologist", priority: 1 },
        "acid": { specialist: "Gastroenterologist", priority: 2 },
        "vomiting": { specialist: "Gastroenterologist", priority: 2 },
        "ulcer": { specialist: "Gastroenterologist", priority: 1 },
        "indigestion": { specialist: "Gastroenterologist", priority: 3 },
        "heartburn": { specialist: "Gastroenterologist", priority: 3 },
        nausea: { specialist: "Gastroenterologist", priority: 2 },
        bloating: { specialist: "Gastroenterologist", priority: 3 },
        constipation: { specialist: "Gastroenterologist", priority: 3 },
        liver: { specialist: "Gastroenterologist", priority: 1 },
        pancreas: { specialist: "Gastroenterologist", priority: 1 },
        colon: { specialist: "Gastroenterologist", priority: 1 },
        "bowel movements": { specialist: "Gastroenterologist", priority: 3 },
    
        // Pediatrician
        child: { specialist: "Pediatrician", priority: 1 },
        baby: { specialist: "Pediatrician", priority: 1 },
        infant: { specialist: "Pediatrician", priority: 1 },
        toddler: { specialist: "Pediatrician", priority: 1 },
        "high fever in child": { specialist: "Pediatrician", priority: 1 },
        "child cold": { specialist: "Pediatrician", priority: 2 },
        "baby flu": { specialist: "Pediatrician", priority: 2 },
        "teething problems": { specialist: "Pediatrician", priority: 3 },
        "growth issues in toddler": { specialist: "Pediatrician", priority: 2 },
        "child vaccination": { specialist: "Pediatrician", priority: 3 },
    
        // Gynecologist
        "pregnancy": { specialist: "Gynecologist", priority: 1 },
        period: { specialist: "Gynecologist", priority: 2 },
        cramps: { specialist: "Gynecologist", priority: 2 },
        "severe menstrual cramps": { specialist: "Gynecologist", priority: 1 },
        "irregular periods": { specialist: "Gynecologist", priority: 2 },
        menopause: { specialist: "Gynecologist", priority: 2 },
        "fertility consultation": { specialist: "Gynecologist", priority: 2 },
        "vaginal": { specialist: "Gynecologist", priority: 2 },
        "pelvic": { specialist: "Gynecologist", priority: 1 },
    
        // General Physician
        "fever": { specialist: "General Physician", priority: 3 },
        "high fever": { specialist: "General Physician", priority: 1 },
        "cough": { specialist: "General Physician", priority: 3 },
        "cold": { specialist: "General Physician", priority: 3 },
        "flu": { specialist: "General Physician", priority: 3 },
        "weakness and fatigue": { specialist: "General Physician", priority: 3 },
        "general body pain": { specialist: "General Physician", priority: 3 },
        "sore throat": { specialist: "General Physician", priority: 3 },
    };
    

    // Analyze the description
    const keywords = Object.keys(symptomToSpecialistMap);
    const matchedSpecialists = new Set();

    for (const keyword of keywords) {
      if (description.toLowerCase().includes(keyword)) {
        const { specialist, priority } = symptomToSpecialistMap[keyword];
        if (
          !matchedSpecialists[specialist] ||
          matchedSpecialists[specialist] > priority
        ) {
          matchedSpecialists[specialist] = priority; // Save the lowest priority for each specialist
        }
      }
    }

    // Sort specialists by priority
    const sortedSpecialists = Object.entries(matchedSpecialists)
      .sort((a, b) => a[1] - b[1]) // Sort by priority
      .map(([specialist]) => specialist);

    // Return the response
    if (sortedSpecialists.length === 0) {
      return res.json({
        success: true,
        specialists: ["General Physician"],
        message:
          "Your symptoms are general. Please consult a General Physician to begin with.",
      });
    } else {
      return res.json({
        success: true,
        specialists: sortedSpecialists,
        message: `Based on your description, you should visit the following specialists: ${sortedSpecialists.join(
          ", "
        )}.`,
      });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  bookAppointment,
  listAppointment,
  cancelAppointment,
  updatePaymentStatus,
  followDoctor,
  searchDoctorsByName,
  suggestSpecialist,
};

// API to book appointment
// const bookAppointment = async(req, res) => {
//     try {
//         const {userId, docId, slotDate, slotTime} = req.body

//         // finding the doctor
//         const docData = await doctorModel.findById(docId).select('-password')

//         if(!docData.available){            // if doctor is not found, print not available
//             return res.json({success: false, message: "Doctor is not available"})
//         }

//         // if doct available, getting the slots booked data
//         let slots_booked = docData.slots_booked

//         // checking for slot availability
//         if(slots_booked[slotDate]) {
//             // checking if slot is available for a certain date & time
//             if(slots_booked[slotDate].includes(slotTime)){
//                 return res.json({success: false, message: "Slot not available"})
//             } else {
//                 slots_booked[slotDate].push(slotTime)        // booking the slot
//             }
//         } else {
//             slots_booked[slotDate] = []
//             slots_booked[slotDate].push(slotTime)
//         }

//         const userData = await userModel.findById(userId).select('-password')

//         delete docData.slots_booked  // we don't want to store slots booked after booking an appointment, so delete it

//         const appointmentData = {         // creating appointment data
//             userId,
//             docId,
//             userData,
//             docData,
//             amount: docData.fees,
//             slotTime,
//             slotDate,
//             date: Date.now()
//         }

//         const newAppointment = new appointmentModel(appointmentData)
//         await newAppointment.save()

//         // save new slots data in docData
//         await doctorModel.findByIdAndUpdate(docId, {slots_booked})

//         res.json({success: true, message: "Appointment Booked"})

// API to book appointment
// const bookAppointment = async(req, res) => {
//     try {
//         const {userId, docId, slotDate, slotTime} = req.body

//         // finding the doctor
//         const docData = await doctorModel.findById(docId).select('-password')

//         if(!docData.available){            // if doctor is not found, print not available
//             return res.json({success: false, message: "Doctor is not available"})
//         }

//         // if doct available, getting the slots booked data
//         let slots_booked = docData.slots_booked

//         // checking for slot availability
//         if(slots_booked[slotDate]) {
//             // checking if slot is available for a certain date & time
//             if(slots_booked[slotDate].includes(slotTime)){
//                 return res.json({success: false, message: "Slot not available"})
//             } else {
//                 slots_booked[slotDate].push(slotTime)        // booking the slot
//             }
//         } else {
//             slots_booked[slotDate] = []
//             slots_booked[slotDate].push(slotTime)
//         }

//         const userData = await userModel.findById(userId).select('-password')

//         delete docData.slots_booked  // we don't want to store slots booked after booking an appointment, so delete it

//         const appointmentData = {         // creating appointment data
//             userId,
//             docId,
//             userData,
//             docData,
//             amount: docData.fees,
//             slotTime,
//             slotDate,
//             date: Date.now()
//         }

//     } catch (error) {
//         console.log(error)
//         res.json({success: false, message: error.message})
//     }
// }
//         const newAppointment = new appointmentModel(appointmentData)
//         await newAppointment.save()

//         // save new slots data in docData
//         await doctorModel.findByIdAndUpdate(docId, {slots_booked})

//         res.json({success: true, message: "Appointment Booked"})

//     } catch (error) {
//         console.log(error)
//         res.json({success: false, message: error.message})
//     }
// }

// import validator from 'validator';
// import bcrypt from 'bcrypt';
// import userModel from '../models/userModel.js';
// import jwt from 'jsonwebtoken';
// import { v2 as cloudinary } from "cloudinary";
// import doctorModel from '../models/doctorModel.js';
// import appointmentModel from '../models/appointmentModel.js';

// // STRATEGY DESIGN PATTERN: Validation strategies
// class ValidationStrategy {
//     validate(data) {
//         throw new Error("Validation strategy not implemented");
//     }
// }

// class EmailValidationStrategy extends ValidationStrategy {
//     validate(email) {
//         if (!validator.isEmail(email)) {
//             throw new Error("Please enter a valid email");
//         }
//     }
// }

// class PasswordValidationStrategy extends ValidationStrategy {
//     validate(password) {
//         const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
//         if (!passwordRegex.test(password)) {
//             throw new Error("Password must be at least 8 characters long and include uppercase, lowercase, digits, and special characters");
//         }
//     }
// }

// // DECORATOR DESIGN PATTERN: Enhancing user data processing
// class UserDecorator {
//     constructor(userData) {
//         this.userData = userData;
//     }

//     async hashPassword() {
//         const salt = await bcrypt.genSalt(10);
//         this.userData.password = await bcrypt.hash(this.userData.password, salt);
//         return this.userData;
//     }
// }

// // FACTORY DESIGN PATTERN: Response Factory
// class ResponseFactory {
//     static createSuccessResponse(message, data = null) {
//         return { success: true, message, data };
//     }

//     static createErrorResponse(message) {
//         return { success: false, message };
//     }
// }

// // API to register user
// const registerUser = async (req, res) => {
//     try {
//         const { name, email, password } = req.body;

//         // Validate inputs using strategy pattern
//         const emailValidator = new EmailValidationStrategy();
//         const passwordValidator = new PasswordValidationStrategy();

//         emailValidator.validate(email);
//         passwordValidator.validate(password);

//         // Hash password using decorator pattern
//         const userDecorator = new UserDecorator({ name, email, password });
//         const hashedUserData = await userDecorator.hashPassword();

//         // Save user to database
//         const newUser = new userModel(hashedUserData);
//         const user = await newUser.save();

//         // Create token for authentication
//         const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

//         // Respond with success
//         res.json(ResponseFactory.createSuccessResponse("User registered successfully", { token }));

//     } catch (error) {
//         console.log(error);
//         res.json(ResponseFactory.createErrorResponse(error.message));
//     }
// };

// // API for user login
// const loginUser = async (req, res) => {
//     try {
//         const { email, password } = req.body;

//         const user = await userModel.findOne({ email });
//         if (!user) {
//             return res.json(ResponseFactory.createErrorResponse("User does not exist"));
//         }

//         // Compare passwords
//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) {
//             return res.json(ResponseFactory.createErrorResponse("Invalid credentials"));
//         }

//         // Create token
//         const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
//         res.json(ResponseFactory.createSuccessResponse("Login successful", { token }));

//     } catch (error) {
//         console.log(error);
//         res.json(ResponseFactory.createErrorResponse(error.message));
//     }
// };

// // API to get user profile data
// const getProfile = async (req, res) => {
//     try {
//         const { userId } = req.body;
//         const userData = await userModel.findById(userId).select('-password');

//         res.json(ResponseFactory.createSuccessResponse("Profile retrieved", userData));
//     } catch (error) {
//         console.log(error);
//         res.json(ResponseFactory.createErrorResponse(error.message));
//     }
// };

// // API to update user profile
// const updateProfile = async (req, res) => {
//     try {
//         const { userId, name, phone, address, dob, gender } = req.body;
//         const imageFile = req.file;

//         if (!name || !phone || !address || !dob || !gender) {
//             return res.json(ResponseFactory.createErrorResponse("Missing Details"));
//         }

//         await userModel.findByIdAndUpdate(userId, {
//             name,
//             phone,
//             address: JSON.parse(address),
//             dob,
//             gender,
//         });

//         if (imageFile) {
//             // Upload image to Cloudinary
//             const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });
//             const imageUrl = imageUpload.secure_url;

//             await userModel.findByIdAndUpdate(userId, { image: imageUrl });
//         }

//         res.json(ResponseFactory.createSuccessResponse("Profile updated successfully"));

//     } catch (error) {
//         console.log(error);
//         res.json(ResponseFactory.createErrorResponse(error.message));
//     }
// };

// // API to book appointment
// const bookAppointment = async (req, res) => {
//     try {
//         const { userId, docId, slotDate, slotTime } = req.body;

//         // Find the doctor
//         const docData = await doctorModel.findById(docId).select('-password');
//         if (!docData.available) {
//             return res.json(ResponseFactory.createErrorResponse("Doctor is not available"));
//         }

//         let slots_booked = docData.slots_booked || {};
//         if (slots_booked[slotDate]?.includes(slotTime)) {
//             return res.json(ResponseFactory.createErrorResponse("Slot not available"));
//         }

//         // Update slots
//         slots_booked[slotDate] = slots_booked[slotDate] || [];
//         slots_booked[slotDate].push(slotTime);

//         // Save appointment
//         const appointmentData = {
//             userId,
//             docId,
//             amount: docData.fees,
//             slotTime,
//             slotDate,
//             date: Date.now(),
//         };

//         const newAppointment = new appointmentModel(appointmentData);
//         await newAppointment.save();
//         await doctorModel.findByIdAndUpdate(docId, { slots_booked });

//         res.json(ResponseFactory.createSuccessResponse("Appointment booked successfully"));

//     } catch (error) {
//         console.log(error);
//         res.json(ResponseFactory.createErrorResponse(error.message));
//     }
// };

// export { registerUser, loginUser, getProfile, updateProfile, bookAppointment };
