import express from 'express';
import { createAvailability, getAvailability } from '../controllers/availabilityController.js';
import { protect, doctorOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createAvailability);
router.get('/:doctorId', getAvailability);

export default router; 