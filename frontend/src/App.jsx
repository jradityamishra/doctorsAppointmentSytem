import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';

// Pages
import Home from './pages/Home';
import DoctorProfile from './pages/DoctorProfile';

// Components
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import PatientDashboard from './components/Patient/Dashboard';
import DoctorDashboard from './components/Doctor/Dashboard';
import AppointmentsList from './components/Patient/AppointmentsList';
import ViewAppointments from './components/Doctor/ViewAppointments';
import SetAvailability from './components/Doctor/SetAvailability';

// Protected Route component
const ProtectedRoute = ({ element, allowedUserType }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  if (allowedUserType && user.userType !== allowedUserType) {
    return <Navigate to={`/${user.userType}/dashboard`} />;
  }
  
  return element;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/doctors/:id" element={<DoctorProfile />} />

          {/* Patient Routes */}
          <Route 
            path="/patient/dashboard" 
            element={<ProtectedRoute element={<PatientDashboard />} allowedUserType="patient" />} 
          />
          <Route 
            path="/patient/appointments" 
            element={<ProtectedRoute element={<AppointmentsList />} allowedUserType="patient" />} 
          />

          {/* Doctor Routes */}
          <Route 
            path="/doctor/dashboard" 
            element={<ProtectedRoute element={<DoctorDashboard />} allowedUserType="doctor" />} 
          />
          <Route 
            path="/doctor/appointments" 
            element={<ProtectedRoute element={<ViewAppointments />} allowedUserType="doctor" />} 
          />
          <Route 
            path="/doctor/availability" 
            element={<ProtectedRoute element={<SetAvailability />} allowedUserType="doctor" />} 
          />

          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
