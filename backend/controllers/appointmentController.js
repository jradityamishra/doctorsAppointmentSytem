import mongoose from 'mongoose';
import Appointment from '../models/Appointment.js';
import Availability from '../models/Availability.js';
import Doctor from '../models/Doctor.js';
import Patient from '../models/Patient.js';
import { sendBookingEmail, sendCancellationEmail } from '../utils/sendEmail.js';

// @desc    Book an appointment
// @route   POST /api/appointments/book
// @access  Private/Patient
export const bookAppointment = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const { availabilityId } = req.body;
    const patientId = req.user._id;
    
    // Find the availability slot and lock it for booking
    const availability = await Availability.findOne({
      _id: availabilityId,
      isBooked: false,
    }).session(session);
    
    if (!availability) {
      throw new Error('Slot is no longer available');
    }
    
    // Mark the availability as booked
    availability.isBooked = true;
    await availability.save({ session });
    
    // Create an appointment
    const appointment = new Appointment({
      doctor: availability.doctor,
      patient: patientId,
      availability: availabilityId,
      status: 'booked',
    });
    
    await appointment.save({ session });
    
    // Commit the transaction
    await session.commitTransaction();
    session.endSession();
    
    // Fetch doctor and patient data for the email
    const doctor = await Doctor.findById(availability.doctor);
    const patient = await Patient.findById(patientId);
    
    // Populate availability details for the response
    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate('doctor', 'name email specialty')
      .populate('patient', 'name email')
      .populate('availability');
    
    // Send confirmation emails
    try {
      await sendBookingEmail(patient.email, populatedAppointment, doctor, patient);
      await sendBookingEmail(doctor.email, populatedAppointment, doctor, patient);
    } catch (emailError) {
      console.error('Error sending confirmation email:', emailError);
      // Continue since the booking was successful
    }
    
    res.status(201).json(populatedAppointment);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ error: error.message });
  }
};

// @desc    Cancel an appointment
// @route   PUT /api/appointments/:id/cancel
// @access  Private/Patient
export const cancelAppointment = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const appointmentId = req.params.id;
    
    // Find the appointment
    const appointment = await Appointment.findById(appointmentId)
      .populate('doctor')
      .populate('patient')
      .populate('availability')
      .session(session);
    
    if (!appointment) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ error: 'Appointment not found' });
    }
    
    // Check if the user is the patient who booked the appointment
    if (appointment.patient._id.toString() !== req.user._id.toString()) {
      await session.abortTransaction();
      session.endSession();
      return res.status(403).json({ error: 'Not authorized to cancel this appointment' });
    }
    
    // Check if the appointment is already canceled
    if (appointment.status === 'canceled') {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ error: 'Appointment is already canceled' });
    }
    
    // Mark the appointment as canceled
    appointment.status = 'canceled';
    await appointment.save({ session });
    
    // Make the availability slot available again
    const availability = await Availability.findById(appointment.availability._id).session(session);
    availability.isBooked = false;
    await availability.save({ session });
    
    // Commit the transaction
    await session.commitTransaction();
    session.endSession();
    
    // Send cancellation emails
    try {
      await sendCancellationEmail(
        appointment.patient.email,
        appointment,
        appointment.doctor,
        appointment.patient
      );
      await sendCancellationEmail(
        appointment.doctor.email,
        appointment,
        appointment.doctor,
        appointment.patient
      );
    } catch (emailError) {
      console.error('Error sending cancellation email:', emailError);
      // Continue since the cancellation was successful
    }
    
    res.json(appointment);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get all appointments for a patient
// @route   GET /api/appointments/patient
// @access  Private/Patient
export const getPatientAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ patient: req.user._id })
      .populate('doctor', 'name specialty')
      .populate('availability')
      .sort('-createdAt');
    
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get all appointments for a doctor
// @route   GET /api/appointments/doctor
// @access  Private/Doctor
export const getDoctorAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ doctor: req.user._id })
      .populate('patient', 'name email')
      .populate('availability')
      .sort('-createdAt');
    
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 