import mongoose from 'mongoose';

const AppointmentSchema = new mongoose.Schema(
  {
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
      required: true,
    },
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: true,
    },
    availability: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Availability',
      required: true,
    },
    status: {
      type: String,
      enum: ['booked', 'canceled'],
      default: 'booked',
    },
  },
  {
    timestamps: true,
  }
);

// Creating indexes for efficient querying
AppointmentSchema.index({ patient: 1, status: 1 });
AppointmentSchema.index({ doctor: 1, status: 1 });

const Appointment = mongoose.model('Appointment', AppointmentSchema);

export default Appointment; 