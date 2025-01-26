// Command: Encapsulates the request to change availability
class ChangeAvailabilityCommand {
    constructor(docId, doctorModel) {
        this.docId = docId;
        this.doctorModel = doctorModel;
    }

    // Execute method to perform the action
    async execute() {
        try {
            const doctor = await this.doctorModel.findById(this.docId);
            if (!doctor) {
                throw new Error("Doctor not found");
            }

            // Toggle the availability of the doctor
            const updatedDoctor = await this.doctorModel.findByIdAndUpdate(this.docId, {
                available: !doctor.available
            }, { new: true });

            return {
                success: true,
                message: `Doctor availability updated to ${updatedDoctor.available ? "Available" : "Unavailable"}`,
            };
        } catch (error) {
            console.error(error);
            return { success: false, message: error.message };
        }
    }
}

// Invoker: Executes the command
class CommandInvoker {
    constructor() {
        this.command = null;
    }

    // Set command
    setCommand(command) {
        this.command = command;
    }

    // Execute the command
    async executeCommand() {
        if (this.command) {
            return await this.command.execute();
        }
        return { success: false, message: 'No command set' };
    }
}

// API handler to change doctor availability (Client)
const changeAvailability = async (req, res) => {
    try {
        const { docId } = req.body;

        // Create command to change availability
        const command = new ChangeAvailabilityCommand(docId, doctorModel);

        // Create invoker and set the command
        const invoker = new CommandInvoker();
        invoker.setCommand(command);

        // Execute the command
        const result = await invoker.executeCommand();
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};
