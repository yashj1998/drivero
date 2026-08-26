import mongoose from 'mongoose';

const SpecSchema = new mongoose.Schema({
  icon: { type: String, default: 'Gauge' },
  label: { type: String, required: true },
  value: { type: String, required: true },
}, { _id: false });

const CarSchema = new mongoose.Schema({
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  brand: {
    type: String,
    required: true,
    trim: true,
  },
  tag: {
    type: String,
    required: true,
    enum: ['Sports', 'Convertible', 'Supercar', 'Coupe', 'SUV', 'Luxury'],
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  img: {
    type: String,
    required: true,
  },
  gallery: [{
    type: String,
  }],
  rating: {
    type: Number,
    default: 4.8,
    min: 1,
    max: 5,
  },
  seats: {
    type: Number,
    default: 2,
  },
  specs: [SpecSchema],
  description: {
    type: String,
    required: true,
  },
  features: [{
    type: String,
  }],
  isAvailable: {
    type: Boolean,
    default: true,
  },
  totalRentals: {
    type: Number,
    default: 0,
  },
  activeBookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    default: null,
  }
}, {
  timestamps: true,
});

export const Car = mongoose.model('Car', CarSchema);
