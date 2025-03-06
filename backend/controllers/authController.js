import Doctor from '../models/Doctor.js';
import Patient from '../models/Patient.js';
import generateToken from '../utils/generateToken.js';

// @desc    Register a patient
// @route   POST /api/auth/register/patient
// @access  Public
export const registerPatient = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if patient already exists
    const patientExists = await Patient.findOne({ email });

    if (patientExists) {
      return res.status(400).json({ error: 'Patient already exists' });
    }

    // Create patient
    const patient = await Patient.create({
      name,
      email,
      password,
    });

    if (patient) {
      res.status(201).json({
        _id: patient._id,
        name: patient.name,
        email: patient.email,
        userType: 'patient',
        token: generateToken(patient._id, 'patient'),
      });
    } else {
      res.status(400).json({ error: 'Invalid patient data' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Register a doctor
// @route   POST /api/auth/register/doctor
// @access  Public
export const registerDoctor = async (req, res) => {
  try {
    const { name, email, password, specialty, experience, location, consultationLocations } = req.body;

    // Check if doctor already exists
    const doctorExists = await Doctor.findOne({ email });

    if (doctorExists) {
      return res.status(400).json({ error: 'Doctor already exists' });
    }

    // Create doctor
    const doctor = await Doctor.create({
      name,
      email,
      password,
      specialty,
      experience,
      location,
      consultationLocations,
    });

    if (doctor) {
      res.status(201).json({
        _id: doctor._id,
        name: doctor.name,
        email: doctor.email,
        userType: 'doctor',
        specialty: doctor.specialty,
        experience: doctor.experience,
        location: doctor.location,
        consultationLocations: doctor.consultationLocations,
        token: generateToken(doctor._id, 'doctor'),
      });
    } else {
      res.status(400).json({ error: 'Invalid doctor data' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { email, password, userType } = req.body;

    let user;

    // Check if user exists based on userType
    if (userType === 'doctor') {
      user = await Doctor.findOne({ email });
    } else if (userType === 'patient') {
      user = await Patient.findOne({ email });
    } else {
      return res.status(400).json({ error: 'Invalid user type' });
    }

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Return user data and token based on user type
    if (userType === 'doctor') {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        userType,
        specialty: user.specialty,
        experience: user.experience,
        location: user.location,
        consultationLocations: user.consultationLocations,
        token: generateToken(user._id, userType),
      });
    } else {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        userType,
        token: generateToken(user._id, userType),
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
}; 