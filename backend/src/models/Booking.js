import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema({
  bookingNumber: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true,
  },
  customerSnapshot: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    licenseNumber: { type: String, default: '' },
    address: { type: String, default: '' },
    city: { type: String, default: '' },
  },
  car: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Car',
    required: true,
  },
  carSnapshot: {
    name: { type: String, required: true },
    slug: { type: String, required: true },
    brand: { type: String, required: true },
    tag: { type: String, required: true },
    pricePerDay: { type: Number, required: true },
    img: { type: String, required: true },
  },
  pickupLocation: {
    type: String,
    required: true,
  },
  deliveryAddress: {
    type: String,
    default: '',
  },
  pickupDate: {
    type: Date,
    required: true,
  },
  returnDate: {
    type: Date,
    required: true,
  },
  days: {
    type: Number,
    required: true,
    min: 1,
  },
  priceBreakdown: {
    subtotal: { type: Number, required: true },
    insurance: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    promoCode: { type: String, default: '' },
    total: { type: Number, required: true },
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'in_transit', 'delivered', 'completed', 'cancelled'],
    default: 'confirmed',
  },
  statusTimeline: [
    {
      status: { type: String, required: true },
      timestamp: { type: Date, default: Date.now },
      note: { type: String, default: '' },
    }
  ],
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded'],
    default: 'paid',
  },
  paymentMethod: {
    type: String,
    default: 'Credit Card / Online',
  },
  notes: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

export const Booking = mongoose.model('Booking', BookingSchema);
