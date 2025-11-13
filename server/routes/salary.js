import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { addsalary , getSalary } from '../controllers/salaryController.js';

 
const router = express.Router();

router.post('/add', authMiddleware, addsalary)
router.get('/:id', authMiddleware, getSalary)



export default router;