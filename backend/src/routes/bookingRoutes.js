import express from 'express';
import {
  createBooking,
  getAllBookings,
  getBookingById,
  updateBookingStatus,
  deleteBooking,
} from '../controllers/bookingController.js';
import { protectAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public: Book now
router.post('/', createBooking);

// Admin protected endpoints
router.get('/', protectAdmin, getAllBookings);
router.get('/:id', protectAdmin, getBookingById);
router.patch('/:id/status', protectAdmin, updateBookingStatus);
router.delete('/:id', protectAdmin, deleteBooking);

export default router;
