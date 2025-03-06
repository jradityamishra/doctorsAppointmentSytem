import axios from 'axios';

// Set base URL
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// API service for doctors
export const doctorService = {
  // Get all doctors
  getDoctors: async (filters = {}) => {
    try {
      const { specialty, location, name } = filters;
      const params = new URLSearchParams();
      
      if (specialty) params.append('specialty', specialty);
      if (location) params.append('location', location);
      if (name) params.append('name', name);
      
      const response = await axios.get(`/api/doctors?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },
  
  // Get doctor by ID
  getDoctorById: async (id) => {
    try {
      const response = await axios.get(`/api/doctors/${id}`);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },
};

// API service for availability
export const availabilityService = {
  // Create availability slot
  createAvailability: async (availabilityData) => {
    try {
      const response = await axios.post('/api/availability', availabilityData);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },
  
  // Get availability for a doctor
  getAvailability: async (doctorId, date) => {
    try {
      const params = new URLSearchParams();
      if (date) params.append('date', date);
      
      const response = await axios.get(`/api/availability/${doctorId}?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },
};

// API service for appointments
export const appointmentService = {
  // Book an appointment
  bookAppointment: async (availabilityId) => {
    try {
      const response = await axios.post('/api/appointments/book', { availabilityId });
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },
  
  // Cancel an appointment
  cancelAppointment: async (id) => {
    try {
      const response = await axios.put(`/api/appointments/${id}/cancel`);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },
  
  // Get patient appointments
  getPatientAppointments: async () => {
    try {
      const response = await axios.get('/api/appointments/patient');
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },
  
  // Get doctor appointments
  getDoctorAppointments: async () => {
    try {
      const response = await axios.get('/api/appointments/doctor');
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },
}; 