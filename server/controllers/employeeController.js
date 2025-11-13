import multer from 'multer';
import Employee from '../models/Employee.js';
import User from '../models/User.js';
import bcrypt from 'bcrypt';
import path from 'path';

// ----------------------- Multer Storage Setup -----------------------
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));  
    }
});

const upload = multer({ storage: storage });

// ----------------------- Add Employee -----------------------
const addEmployee = async (req, res) => {
    try {
        const {
            name,
            email,
            employeeId,
            dob,
            gender,
            maritalStatus,
            designation,
            department,
            salary,
            password,
            role,
        } = req.body;

        // Validate email
        if (!email || !email.trim()) {
            return res.status(400).json({ success: false, error: "Email is required" });
        }

        // Check if employeeId already exists
        const existingEmployee = await Employee.findOne({ employeeId });
        if (existingEmployee) {
            return res.status(400).json({ success: false, error: "Employee ID already exists" });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email: email.trim().toLowerCase() });
        if (existingUser) {
            return res.status(400).json({ success: false, error: "User already registered" });
        }

        // Hash password
        const hashPassword = await bcrypt.hash(password, 10);

        // Create user
        const newUser = new User({
            name,
            email,
            password: hashPassword,
            role,
            profileImage: req.file ? req.file.filename : "",
        });
        const savedUser = await newUser.save();

        // Create employee
        const newEmployee = new Employee({
            userId: savedUser._id,
            employeeId,
            dob,
            gender,
            maritalStatus,
            designation,
            department,
            salary,
        });
        await newEmployee.save();

        return res.status(200).json({ success: true, message: "Employee created successfully" });

    } catch (error) {
        console.error("Error adding employee:", error.message);
        return res.status(500).json({ success: false, error: "Server error while adding employee" });
    }
};

// ----------------------- Get Employee -----------------------
const getEmployee = async (req, res) => {
  const { id } = req.params;
  try {
    let employee = await Employee.findById(id)
      .populate('userId', { password: 0 })
      .populate('department');

    // If not found by _id, try by userId
    if (!employee) {
      employee = await Employee.findOne({ userId: id })
        .populate('userId', { password: 0 })
        .populate('department');
    }

    // If still not found, return 404
    if (!employee) {
      return res.status(404).json({ success: false, error: "Employee not found" });
    }

    // Otherwise, return employee data
    return res.status(200).json({ success: true, employee });
  } catch (error) {
    console.error("Error fetching employee:", error.message);
    return res.status(500).json({ success: false, error: "Server error fetching employee" });
  }
};


// ----------------------- Update Employee -----------------------
const updateEmployee = async (req, res) => {
    const { id } = req.params;
    const {
        name,
        email,
        employeeId,
        dob,
        gender,
        maritalStatus,
        designation,
        department,
        salary,
        role,
        password,
    } = req.body;

    try {
        // Check if employee exists
        const employee = await Employee.findById(id).populate('userId');
        if (!employee) {
            return res.status(404).json({ success: false, error: "Employee not found" });
        }

        // Validate and check if the email is different before updating
        if (email && email.trim() !== employee.userId.email) {
            const existingUser = await User.findOne({ email: email.trim().toLowerCase() });
            if (existingUser) {
                return res.status(400).json({ success: false, error: "User with this email already exists" });
            }
        }

        // Update employee data
        employee.employeeId = employeeId || employee.employeeId;
        employee.dob = dob || employee.dob;
        employee.gender = gender || employee.gender;
        employee.maritalStatus = maritalStatus || employee.maritalStatus;
        employee.designation = designation || employee.designation;
        employee.department = department || employee.department;
        employee.salary = salary || employee.salary;

        // Update user details
        const user = employee.userId;
        user.name = name || user.name;
        user.email = email ? email.trim().toLowerCase() : user.email;
        user.role = role || user.role;

        // If there's an image, update the image filename
        if (req.file) {
            user.profileImage = req.file.filename;
        }

        // Hash password if it's being changed
        if (password) {
            const hashPassword = await bcrypt.hash(password, 10);
            user.password = hashPassword;
        }

        // Save the updated user and employee data
        await user.save();
        await employee.save();

        return res.status(200).json({ success: true, message: "Employee updated successfully", employee });

    } catch (error) {
        console.error("Error updating employee:", error.message);
        return res.status(500).json({ success: false, error: "Server error updating employee" });
    }
};

// ----------------------- Get All Employees -----------------------
const getEmployees = async (req, res) => {
    try {
        const employees = await Employee.find()
            .populate('userId', { password: 0 })
            .populate('department');            

        return res.status(200).json({ success: true, employees });
    } catch (error) {
        console.error("Error fetching employees:", error.message);
        return res.status(500).json({ success: false, error: "Server error fetching employees" });
    }
};


const fetchEmployeesByDepId = async (req, res) => {
    const { id } = req.params;
    try {
        const employees = await Employee.find({ department: id });
        return res.status(200).json({ success: true, employees });
    } catch (error) {
        console.error("Error fetching employee:", error.message);
        return res.status(500).json({ success: false, error: "Get employees by department ID server error." });
    }
};

export { fetchEmployeesByDepId, addEmployee, upload, getEmployees, getEmployee, updateEmployee };
