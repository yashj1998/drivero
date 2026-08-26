import mongoose from 'mongoose';

const ContactMessageSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, default: '' },
  message: { type: String, required: true },
  status: {
    type: String,
    enum: ['unread', 'read', 'replied'],
    default: 'unread',
  }
}, {
  timestamps: true,
});

export const ContactMessage = mongoose.model('ContactMessage', ContactMessageSchema);
