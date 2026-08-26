import mongoose from 'mongoose';

const CustomerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    index: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  licenseNumber: {
    type: String,
    trim: true,
    default: '',
  },
  address: {
    type: String,
    trim: true,
    default: '',
  },
  city: {
    type: String,
    trim: true,
    default: '',
  },
  totalBookings: {
    type: Number,
    default: 1,
  },
  totalSpent: {
    type: Number,
    default: 0,
  },
  lastBookingDate: {
    type: Date,
    default: Date.now,
  },
  notes: {
    type: String,
    default: '',
  }
}, {
  timestamps: true,
});

export const Customer = mongoose.model('Customer', CustomerSchema);
