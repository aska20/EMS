import Salary from '../models/Salary.js';
import  Employee from '../models/Employee.js';

const addsalary = async (req, res) => {
    try {
        const { employeeId, basicSalary, allowances, deductions, payDate } = req.body;
        const totalSalary = parseInt(basicSalary)  + parseInt(allowances) - parseInt(deductions);

        const newSalary = new Salary({
            employeeId,
            basicSalary,
            allowances,
            deductions,
            netSalary: totalSalary,
            payDate,
        });

        await newSalary.save();
        return res.status(200).json({ success: true, message: "Salary record added successfully" });
    } catch (error) {
        console.error("Error adding salary record:", error.message);
        return res.status(500).json({ success: false, error: "Server error while adding salary record" });
    }


}

const getSalary = async (req, res) => {
    try {
        const { id } = req.params;
        let salary = await Salary.find({ employeeId: id }).populate('employeeId', 'employeeId');

        if (salary.length === 0) {
            const employee = await Employee.findOne({ userId: id });
            if (!employee) {
                return res.status(404).json({ success: false, error: "Employee not found" });
            }
            salary = await Salary.find({ employeeId: employee._id }).populate('employeeId', 'employeeId');
        }

        return res.status(200).json({ success: true, salary });
    } catch (error) {
        return res.status(500).json({ success: false, error: "Server error while fetching salary record" });
    }
};

export { addsalary, getSalary };
