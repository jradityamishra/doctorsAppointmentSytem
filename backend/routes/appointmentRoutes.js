import express from 'express';
import { bookAppointment, cancelAppointment, getPatientAppointments, getDoctorAppointments } from '../controllers/appointmentController.js';
import { protect, patientOnly, doctorOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/book', protect, patientOnly, bookAppointment);
router.put('/:id/cancel', protect, cancelAppointment);
router.get('/patient', protect, patientOnly, getPatientAppointments);
router.get('/doctor', protect, doctorOnly, getDoctorAppointments);

export default router; 