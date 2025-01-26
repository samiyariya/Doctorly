class DoctorFactory {
    static async createDoctor({ name, email, password, speciality, degree, experience, about, fees, address, imageFile }) {
        // Checking if all required fields are provided
        if (!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address) {
            throw new Error('Missing Details');
        }

        // Validating email format
        if (!validator.isEmail(email)) {
            throw new Error('Please enter a valid email');
        }

        // Validating strong password
        if (password.length < 8) {
            throw new Error('Please enter a strong password');
        }

        // Hashing the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Uploading image to Cloudinary
        const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: 'image' });
        const imageUrl = imageUpload.secure_url;

        // Creating doctor data object
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
            date: Date.now(),
        };

        return new doctorModel(doctorData);  // Returning the new Doctor instance
    }
}

// API for adding doctor using Factory Pattern
const addDoctor = async (req, res) => {
    try {
        const { name, email, password, speciality, degree, experience, about, fees, address } = req.body;
        const imageFile = req.file;

        // Create a new Doctor instance using the Factory
        const newDoctor = await DoctorFactory.createDoctor({
            name,
            email,
            password,
            speciality,
            degree,
            experience,
            about,
            fees,
            address,
            imageFile,
        });

        // Save the new doctor to the database
        await newDoctor.save();

        res.json({ success: true, message: "Doctor added successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};
