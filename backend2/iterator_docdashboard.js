class AppointmentIterator {
    constructor(appointments) {
        this.appointments = appointments;
        this.index = 0;
    }

    hasNext() {
        return this.index < this.appointments.length;
    }

    next() {
        return this.appointments[this.index++];
    }
}

const doctorDashboard = async (req, res) => {
    try {
        const { docId } = req.body;
        const appointments = await appointmentModel.find({ docId });

        // Create an instance of the iterator
        const iterator = new AppointmentIterator(appointments);

        let earnings = 0;
        let patients = new Set();

        // Iterate through the appointments using the iterator
        while (iterator.hasNext()) {
            const appointment = iterator.next();

            // Summing earnings
            if (appointment.isCompleted || appointment.payment) {
                earnings += appointment.amount;
            }

            // Tracking unique patients
            patients.add(appointment.userId);
        }

        const dashData = {
            earnings,
            appointments: appointments.length,
            patients: patients.size, // Using the Set to count unique patients
            latestAppointments: appointments.reverse().slice(0, 5),
        };

        res.json({ success: true, dashData });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};