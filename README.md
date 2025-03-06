Doctor Appointment System - Arogo AI's Clinic360
This is a MERN stack (MongoDB, Express.js, React, Node.js) application designed for Arogo AI’s Clinic360 platform. The system allows patients to search for doctors, book appointments, and manage their bookings, while doctors can manage their availability and view their appointments. The application uses JWT-based authentication, MongoDB transactions for concurrency control, and Nodemailer for email notifications.

Features
1. User Authentication
JWT-based authentication for both doctors and patients.
Separate models for Doctor and Patient with role-based access control.
Password hashing using bcrypt for secure storage.
2. Doctor Search
Patients can search for doctors by:
Specialty (e.g., Cardiologist, Dermatologist).
Location (city, state).
Name (partial match supported).
Efficient querying using MongoDB indexes on searchable fields.
3. Appointment Booking
Patients can view available time slots for a doctor and book appointments.
Concurrency control using MongoDB transactions to prevent double booking.
Email notifications sent to both the patient and doctor upon booking or cancellation using Nodemailer.
4. Doctor Profile Management
Doctors can:
Set their availability (date, time, location).
Manage consultation locations.
View their upcoming appointments.
5. Frontend
Built with React and Tailwind CSS for a responsive and modern UI.
Protected routes for authenticated users (patients and doctors).
State management using Context API or Redux Toolkit.
6. Backend
RESTful API built with Express.js.
Database: MongoDB with models for Doctor, Patient, Appointment, and Availability.
MongoDB transactions for atomic operations during booking and cancellation.
Database Schema
1. Doctor
javascript
Copy
{
  name: String,
  email: { type: String, unique: true },
  password: String,
  specialty: String,
  experience: Number,
  location: {
    city: String,
    state: String
  },
  consultationLocations: [String], // Array of addresses
  createdAt: Date,
  updatedAt: Date
}
2. Patient
javascript
Copy
{
  name: String,
  email: { type: String, unique: true },
  password: String,
  appointments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' }],
  createdAt: Date,
  updatedAt: Date
}
3. Availability
javascript
Copy
{
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' },
  start: Date, // ISO date including time
  end: Date,
  location: String, // Selected from Doctor's consultationLocations
  isBooked: { type: Boolean, default: false },
  createdAt: Date,
  updatedAt: Date
}
4. Appointment
javascript
Copy
{
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' },
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' },
  availability: { type: mongoose.Schema.Types.ObjectId, ref: 'Availability' },
  status: { type: String, enum: ['booked', 'canceled'], default: 'booked' },
  createdAt: Date,
  updatedAt: Date
}
API Endpoints
1. Authentication
POST /api/auth/register/patient: Register a new patient.
POST /api/auth/register/doctor: Register a new doctor.
POST /api/auth/login: Login for both patients and doctors.
2. Doctors
GET /api/doctors: Search doctors by specialty, location, and name.
GET /api/doctors/:id: Get details of a specific doctor.
3. Appointments
POST /api/appointments/book: Book an appointment (requires patient authentication).
PUT /api/appointments/:id/cancel: Cancel an appointment (requires patient authentication).
GET /api/appointments/patient: Get all appointments for the logged-in patient.
GET /api/appointments/doctor: Get all appointments for the logged-in doctor.
4. Availability
POST /api/availability: Add availability slots (requires doctor authentication).
GET /api/availability/:doctorId: Get available slots for a specific doctor.
Frontend Structure
Folder Structure
pgsql
Copy
src/
├── components/
│   ├── Auth/
│   │   ├── Login.jsx
│   │   └── Register.jsx
│   ├── Patient/
│   │   ├── SearchDoctors.jsx
│   │   ├── AppointmentsList.jsx
│   │   └── BookAppointment.jsx
│   └── Doctor/
│       ├── Dashboard.jsx
│       ├── SetAvailability.jsx
│       └── Appointments.jsx
├── contexts/
│   ├── AuthContext.js
│   └── AppointmentContext.js
├── services/
│   └── api.js
├── pages/
│   ├── Home.jsx
│   └── DoctorProfile.jsx
├── App.js
└── index.js
Key Features
Protected Routes: Only authenticated users can access certain pages.
Search Filters: Patients can filter doctors by specialty, location, and name.
Booking Interface: Patients can view available slots and book appointments.
Doctor Dashboard: Doctors can manage availability and view appointments.
Setup Instructions
Backend
Clone the repository.
Navigate to the backend directory: cd backend.
Install dependencies: npm install.
Create a .env file and set the following environment variables:
env
Copy
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
Start the server: npm start.
Frontend
Navigate to the frontend directory: cd frontend.
Install dependencies: npm install.
Create a .env file and set the following environment variable:
env
Copy
REACT_APP_API_URL=http://localhost:5000
Start the app: npm start.
Deployment
Backend
Deploy to Render or AWS Lambda.
Set environment variables in the deployment dashboard.
Frontend
Deploy to Vercel.
Set environment variables like REACT_APP_API_URL to point to the backend API.
Testing
Use Postman or curl to test API endpoints.
Test concurrency by sending simultaneous booking requests for the same slot.
Potential Issues & Solutions
Time Zones: Store dates in UTC and convert to local time in the frontend.
Overlapping Slots: Ensure doctors don’t add overlapping availability slots (optional for this project).
Email Failures: Use a retry mechanism or queue for email notifications in production.
Documentation
API Examples: Include sample requests and responses for each endpoint.
Screenshots: Add screenshots of the frontend UI.
Live Demo: Provide a link to the live demo (if deployed).
Technologies Used
Frontend: React, Tailwind CSS, Context API/Redux Toolkit.
Backend: Node.js, Express.js, MongoDB, Mongoose.
Authentication: JWT, bcrypt.
Email Notifications: Nodemailer.
Deployment: Render (backend), Vercel (frontend).
Future Improvements
Implement recurring availability for doctors.
Add patient reviews and ratings for doctors.
Integrate payment gateway for appointment fees.
Use a message queue (e.g., RabbitMQ) for reliable email notifications.
License
This project is licensed under the MIT License. See the LICENSE file for details.

Contact
For any questions or feedback, please contact [Your Name] at [your.email@example.com].