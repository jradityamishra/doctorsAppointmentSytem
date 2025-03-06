import Doctor from '../models/Doctor.js';
import Availability from '../models/Availability.js';

// @desc    Get all doctors with optional filtering
// @route   GET /api/doctors
// @access  Public
export const getDoctors = async (req, res) => {
  try {
    const { specialty, city, state, name } = req.query;
    
    const filter = {};
    
    // Apply filters if they exist
    if (specialty) {
      filter.specialty = { $regex: specialty, $options: 'i' };
    }
    
    if (city) {
      filter['location.city'] = { $regex: city, $options: 'i' };
    }
    
    if (state) {
      filter['location.state'] = { $regex: state, $options: 'i' };
    }
    
    if (name) {
      filter.name = { $regex: name, $options: 'i' };
    }
    
    const doctors = await Doctor.find(filter).select('-password');
    
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get a single doctor by ID
// @route   GET /api/doctors/:id
// @access  Public
export const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).select('-password');
    
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }
    
    // Get available slots for this doctor
    const currentDate = new Date();
    const availabilities = await Availability.find({
      doctor: doctor._id,
      isBooked: false,
      start: { $gt: currentDate },
    }).sort('start');
    
    res.json({
      ...doctor._doc,
      availabilities,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Update doctor's consultation locations
// @route   PUT /api/doctors/update-locations
// @access  Private/Doctor
export const updateConsultationLocations = async (req, res) => {
  try {
    const { consultationLocations } = req.body;
    
    if (!consultationLocations || !Array.isArray(consultationLocations)) {
      return res.status(400).json({ error: 'Consultation locations must be provided as an array' });
    }
    
    const doctor = await Doctor.findById(req.user._id);
    
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }
    
    // Update the doctor's consultation locations
    doctor.consultationLocations = consultationLocations;
    await doctor.save();
    
    // Return the updated doctor without the password
    const updatedDoctor = await Doctor.findById(req.user._id).select('-password');
    
    res.json(updatedDoctor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 