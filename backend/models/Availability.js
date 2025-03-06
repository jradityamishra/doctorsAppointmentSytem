import mongoose from 'mongoose';

const availabilitySchema = new mongoose.Schema(
  {
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
      required: true,
    },
    start: {
      type: Date,
      required: true,
    },
    end: {
      type: Date,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    isBooked: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Creating an index on doctor and start for efficient querying
availabilitySchema.index({ doctor: 1, start: 1 });

const Availability = mongoose.model('Availability', availabilitySchema);

export default Availability; 