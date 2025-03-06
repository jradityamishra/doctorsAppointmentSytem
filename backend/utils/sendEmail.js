import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Create a transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Send booking confirmation email
export const sendBookingEmail = async (to, appointment, doctor, patient) => {
  console.log(process.env.EMAIL_USER, process.env.EMAIL_PASS,to,appointment,doctor,patient);
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: 'Appointment Confirmation',
    html: `
      <h2>Appointment Confirmation</h2>
      <p>Dear ${to === patient.email ? patient.name : doctor.name},</p>
      <p>Your appointment has been confirmed with the following details:</p>
      <ul>
        <li><strong>Doctor:</strong> ${doctor.name}</li>
        <li><strong>Patient:</strong> ${patient.name}</li>
        <li><strong>Date:</strong> ${new Date(appointment.availability.start).toLocaleDateString()}</li>
        <li><strong>Time:</strong> ${new Date(appointment.availability.start).toLocaleTimeString()} - ${new Date(appointment.availability.end).toLocaleTimeString()}</li>
        <li><strong>Location:</strong> ${appointment.availability.location}</li>
      </ul>
      <p>Thank you for using our service.</p>
    `,
  };

  try {
    console.log(mailOptions);
    console.log(transporter);
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

// Send cancellation email
export const sendCancellationEmail = async (to, appointment, doctor, patient) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: 'Appointment Cancellation',
    html: `
      <h2>Appointment Cancellation</h2>
      <p>Dear ${to === patient.email ? patient.name : doctor.name},</p>
      <p>Your appointment has been cancelled with the following details:</p>
      <ul>
        <li><strong>Doctor:</strong> ${doctor.name}</li>
        <li><strong>Patient:</strong> ${patient.name}</li>
        <li><strong>Date:</strong> ${new Date(appointment.availability.start).toLocaleDateString()}</li>
        <li><strong>Time:</strong> ${new Date(appointment.availability.start).toLocaleTimeString()} - ${new Date(appointment.availability.end).toLocaleTimeString()}</li>
        <li><strong>Location:</strong> ${appointment.availability.location}</li>
      </ul>
      <p>Thank you for using our service.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Cancellation email sent to ${to}`);
  } catch (error) {
    console.error('Error sending cancellation email:', error);
  }
};

const sendEmail = async (options) => {
  // Define mail options
  const mailOptions = {
    from: `Doctor Appointment App <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  // Send email
  await transporter.sendMail(mailOptions);
};

export default sendEmail; 