import jwt from 'jsonwebtoken';
import Doctor from '../models/Doctor.js';
import Patient from '../models/Patient.js';

// Middleware to protect routes and verify the token
export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find user - check both patient and doctor collections
      let user = await Patient.findById(decoded.id).select('-password');
      
      if (!user) {
        user = await Doctor.findById(decoded.id).select('-password');
      }

      if (!user) {
        return res.status(401).json({ error: 'Not authorized, user not found' });
      }

      // Set user in request
      req.user = user;
      req.userType = decoded.type; // 'patient' or 'doctor'
      next();
    } catch (error) {
      res.status(401).json({ error: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ error: 'Not authorized, no token' });
  }
};

// Middleware to check if user is a doctor
export const doctorOnly = (req, res, next) => {
  if (req.userType !== 'doctor') {
    return res.status(403).json({ error: 'Access denied. Doctors only.' });
  }
  next();
};

// Middleware to check if user is a patient
export const patientOnly = (req, res, next) => {
  if (req.userType !== 'patient') {
    return res.status(403).json({ error: 'Access denied. Patients only.' });
  }
  next();
}; 