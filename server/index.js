import dotenv from 'dotenv';
dotenv.config(); // Load environment variables ASAP

import express from 'express';
import cors from 'cors';
import authRouter from './routes/auth.js'; 
import departmentRouter from './routes/department.js';
import employeeRouter from './routes/employee.js';
import connectToDatabase from './db/db.js';
import salaryRouter from './routes/salary.js';
import leaveRouter from './routes/leave.js';
import settingRouter from './routes/setting.js';

// Connect to MongoDB
connectToDatabase();

const app = express();

// CORS setup (allow only your frontend)
app.use(cors({
  origin: "http://localhost:5173", // frontend URL
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Parse JSON bodies
app.use(express.json());
app.use('/uploads', express.static('public/uploads'));


// Routes
app.use('/api/auth', authRouter);
app.use('/api/department', departmentRouter);
app.use('/api/employee', employeeRouter);
app.use('/api/salary', salaryRouter);
app.use('/api/leave', leaveRouter);
app.use('/api/setting', settingRouter);
// Optional: test route to check server & CORS
app.get('/api/test', (req, res) => {
  res.json({ success: true, message: "Server & CORS working!" });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
