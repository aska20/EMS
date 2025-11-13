import Leave from '../models/Leave.js';
import Employee from '../models/Employee.js';


const addLeave = async (req, res) => {
    try {
        const { userId, leaveType, startDate, endDate, reason } = req.body;
        const employee = await Employee.findOne({ userId});
    

        const newLeave = new Leave({
           
             employeeId: employee._id, leaveType, startDate, endDate, reason
        });

        await newLeave.save();
        return res.status(200).json({ success: true, message: "Leave requested successfully" });
    } catch (error) {
        console.error("Error adding salary record:", error.message);
        return res.status(500).json({ success: false, error: "Server error while adding Leave record" });
    }

}

const getLeaves = async (req, res) => {
    try {
        const { id } = req.params;
        const employee = await Employee.findOne({ userId: id });
        const leaves = await Leave.find({ employeeId: employee._id });
        return res.status(200).json({ success: true, leaves });

    } catch (error) {
        console.error("Error fetching leaves:", error.message);
        return res.status(500).json({ success: false, error: "Server error while fetching leaves" });
}
};

export { addLeave , getLeaves };
