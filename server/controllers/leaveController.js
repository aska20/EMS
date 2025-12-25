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

const getLeave = async (req, res) => {
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

const getLeaves = async (req, res) => {
    try {
       const leaves = await Leave.find().populate({
            path: 'employeeId',
            populate: [{
                path: 'department',
                select: 'dep_name'
            },
            {
                path: 'userId',
                select: 'name'
            }]
        });
        return res.status(200).json({ success: true, leaves });

    } catch (error) {
        console.error("Error fetching leaves:", error.message);
        return res.status(500).json({ success: false, error: "Server error while fetching leaves" });
}
};

const getLeaveDetail = async (req, res) => {
    try {
        const { id } = req.params;
        const leave = await Leave.findById({_id: id}).populate({
            path: 'employeeId',
            populate: [{
                path: 'department',
                select: 'dep_name'
            },
            {
                path: 'userId',
                select: 'name , profileImage'
            }]
        });
        return res.status(200).json({ success: true, leave });

    } catch (error) {
        console.error("Error fetching leave detail:", error.message);
        return res.status(500).json({ success: false, error: "Server error while fetching leave detail" });
}
};

export { addLeave , getLeave , getLeaves , getLeaveDetail };
