class CancelAppointmentFacade {

    constructor(appointmentModel, doctorModel, appointmentId, userId) {
        this.appointmentModel = appointmentModel;
        this.doctorModel = doctorModel;
        this.appointmentId = appointmentId;
        this.userId = userId;
    }

    async cancel() {
        // Step 1: Get appointment data
        const appointmentData = await this.appointmentModel.findById(this.appointmentId);

        // Step 2: Verify the user
        if (appointmentData.userId !== this.userId) {
            throw new Error("Unauthorized action");
        }

        // Step 3: Cancel the appointment
        await this.appointmentModel.findByIdAndUpdate(this.appointmentId, { cancelled: true });

        // Step 4: Release the doctor slot
        const { docId, slotDate, slotTime } = appointmentData;
        const doctorData = await this.doctorModel.findById(docId);
        let slots_booked = doctorData.slots_booked;

        // Remove the time slot
        slots_booked[slotDate] = slots_booked[slotDate].filter((e) => e !== slotTime);
        await this.doctorModel.findByIdAndUpdate(docId, { slots_booked });

        return { success: true, message: "Appointment Cancelled" };
    }
}

const cancelAppointment = async (req, res) => {
    try {
        const { userId, appointmentId } = req.body;

        // Use the Facade to simplify the cancellation logic
        const facade = new CancelAppointmentFacade(appointmentModel, doctorModel, appointmentId, userId);
        const result = await facade.cancel();

        res.json(result);
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};