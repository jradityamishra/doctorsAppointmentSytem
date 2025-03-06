import express from 'express';
import { getDoctors, getDoctorById, updateConsultationLocations } from '../controllers/doctorController.js';
import { protect, doctorOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getDoctors);
router.get('/:id', getDoctorById);
router.put('/update-locations', protect, doctorOnly, updateConsultationLocations);

export default router; 