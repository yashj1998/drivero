import jwt from 'jsonwebtoken';
import { AdminUser } from '../models/AdminUser.js';

function generateToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'drivero_jwt_super_secret_key_luxury_2026', {
    expiresIn: '7d',
  });
}

// @desc    Admin login
// @route   POST /api/auth/login
// @access  Public
export async function loginAdmin(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide both email and password' });
    }

    const admin = await AdminUser.findOne({ email: email.toLowerCase().trim() });
    if (!admin) {
      return res.status(401).json({ success: false, message: 'Invalid credentials. Check email or password.' });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials. Incorrect password.' });
    }

    admin.lastLogin = new Date();
    await admin.save();

    res.json({
      success: true,
      token: generateToken(admin._id),
      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        lastLogin: admin.lastLogin,
      },
    });
  } catch (error) {
    console.error('Error logging in admin:', error);
    res.status(500).json({ success: false, message: 'Server error logging in' });
  }
}

// @desc    Get current logged-in admin profile
// @route   GET /api/auth/me
// @access  Private
export async function getMe(req, res) {
  try {
    res.json({
      success: true,
      user: req.admin,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching profile' });
  }
}
