import express from 'express';
import {
  createBooking,
  getBookings,
  getBooking,
  deleteBooking,
  getHostBookings,
  updateBookingStatus,
} from '../controllers/bookings';
import { protect } from '../middleware/auth';

const router = express.Router();

router.route('/').get(protect, getBookings).post(protect, createBooking);
router.route('/host').get(protect, getHostBookings);
router.route('/:id').get(protect, getBooking).delete(protect, deleteBooking);
router.route('/:id/status').put(protect, updateBookingStatus);

export default router; 