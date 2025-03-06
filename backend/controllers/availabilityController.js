import mongoose from 'mongoose';
import Availability from '../models/Availability.js';
import Doctor from '../models/Doctor.js';
import { protect, doctorOnly } from '../middleware/authMiddleware.js';

// @desc    Create a new availability slot
// @route   POST /api/availability
// @access  Private/Doctor
export const createAvailability = async (req, res) => {
  try {
    const { start, end, location } = req.body;
    
    // Check if the doctor exists
    const doctor = await Doctor.findById(req.user._id);
    
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }
    
    // Validate that the location is in doctor's consultation locations
    if (!doctor.consultationLocations.includes(location)) {
      return res.status(400).json({ 
        error: 'Location is not in your consultation locations',
        availableLocations: doctor.consultationLocations 
      });
    }
    
    // Validate start and end times
    const startDate = new Date(start);
    const endDate = new Date(end);
    
    if (startDate >= endDate) {
      return res.status(400).json({ error: 'Start time must be before end time' });
    }
    
    if (startDate < new Date()) {
      return res.status(400).json({ error: 'Cannot create availability in the past' });
    }
    
    // Check for overlapping availabilities
    const overlappingAvailability = await Availability.findOne({
      doctor: req.user._id,
      $or: [
        { start: { $lt: endDate }, end: { $gt: startDate } },
        { start: { $gte: startDate, $lt: endDate } },
        { end: { $gt: startDate, $lte: endDate } }
      ]
    });
    
    if (overlappingAvailability) {
      return res.status(400).json({ error: 'Overlapping availability exists' });
    }
    
    // Create the availability
    const availability = await Availability.create({
      doctor: req.user._id,
      start: startDate,
      end: endDate,
      location,
      isBooked: false,
    });
    
    res.status(201).json(availability);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get availability slots for a doctor
// @route   GET /api/availability/:doctorId
// @access  Public
export const getAvailability = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { date } = req.query;
    
    // Check if the doctor exists
    const doctor = await Doctor.findById(doctorId);
    
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }
    
    let query = {
      doctor: doctorId,
      isBooked: false,
      start: { $gt: new Date() },
    };
    
    // If date is provided, filter by that date
    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      
      query.start = { $gte: startOfDay, $lt: endOfDay };
    }
    
    const availabilities = await Availability.find(query).sort('start');
    
    res.json(availabilities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 