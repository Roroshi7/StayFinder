import express from 'express';
import {
  getListings,
  getListing,
  createListing,
  updateListing,
  deleteListing,
} from '../controllers/listings';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

router.route('/').get(getListings).post(protect, authorize('host'), createListing);
router
  .route('/:id')
  .get(getListing)
  .put(protect, authorize('host'), updateListing)
  .delete(protect, authorize('host'), deleteListing);

export default router; 