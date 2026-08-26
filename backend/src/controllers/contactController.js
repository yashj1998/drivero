import { ContactMessage } from '../models/ContactMessage.js';

// @desc    Submit a contact inquiry
// @route   POST /api/contact
// @access  Public
export async function submitContact(req, res) {
  try {
    const { firstName, lastName, email, phone, message } = req.body;

    if (!firstName || !lastName || !email || !message) {
      return res.status(400).json({ success: false, message: 'Please fill in all required fields' });
    }

    const contact = new ContactMessage({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone ? phone.trim() : '',
      message: message.trim(),
    });

    await contact.save();

    res.status(201).json({
      success: true,
      message: 'Thank you for reaching out. Our concierge team will contact you shortly.',
      referenceId: `INQ-${contact._id.toString().slice(-6).toUpperCase()}`,
    });
  } catch (error) {
    console.error('Error submitting contact inquiry:', error);
    res.status(500).json({ success: false, message: 'Server error processing contact submission' });
  }
}

// @desc    Get all inquiries (Admin)
// @route   GET /api/contact
// @access  Private (Admin)
export async function getInquiries(req, res) {
  try {
    const inquiries = await ContactMessage.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      count: inquiries.length,
      data: inquiries,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching inquiries' });
  }
}
