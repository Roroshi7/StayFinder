import { Request, Response, NextFunction } from 'express';
import { Booking } from '../models/Booking';
import { Listing } from '../models/Listing';

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
export const createBooking = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Add user to req.body
    req.body.guest = (req as any).user.id;

    const listing = await Listing.findById(req.body.listing);

    if (!listing) {
      return res.status(404).json({
        success: false,
        error: 'Listing not found',
      });
    }

    // Calculate total price
    const checkIn = new Date(req.body.checkIn);
    const checkOut = new Date(req.body.checkOut);
    const nights = Math.ceil(
      (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)
    );
    req.body.totalPrice = listing.price * nights;

    const booking = await Booking.create(req.body);

    res.status(201).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all bookings for a user
// @route   GET /api/bookings
// @access  Private
export const getBookings = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const bookings = await Booking.find({ guest: (req as any).user.id })
      .populate({
        path: 'listing',
        select: 'title images location price',
      })
      .populate('guest', 'name email');

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
export const getBooking = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate({
        path: 'listing',
        select: 'title images location price host',
        populate: {
          path: 'host',
          select: 'name email',
        },
      })
      .populate('guest', 'name email');

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found',
      });
    }

    // Make sure user is booking owner
    if (booking.guest.toString() !== (req as any).user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to access this booking',
      });
    }

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete (cancel) a booking
// @route   DELETE /api/bookings/:id
// @access  Private
export const deleteBooking = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found',
      });
    }

    // Make sure user is booking owner
    if (booking.guest.toString() !== (req as any).user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to cancel this booking',
      });
    }

    await Booking.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      data: {},
      message: 'Booking cancelled successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get bookings for host's listings
// @route   GET /api/bookings/host
// @access  Private (host only)
export const getHostBookings = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // First get all listings by this host
    const listings = await Listing.find({ host: (req as any).user.id });
    const listingIds = listings.map(listing => listing._id);

    // Then get all bookings for these listings
    const hostBookings = await Booking.find({ listing: { $in: listingIds } })
      .populate({
        path: 'listing',
        select: 'title images location price',
      })
      .populate('guest', 'name email');

    res.status(200).json({
      success: true,
      count: hostBookings.length,
      data: hostBookings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update booking status (approve/reject)
// @route   PUT /api/bookings/:id/status
// @access  Private (host only)
export const updateBookingStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { status } = req.body;
    
    if (!['pending', 'confirmed', 'rejected', 'cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status. Must be pending, confirmed, rejected, or cancelled',
      });
    }

    const booking = await Booking.findById(req.params.id)
      .populate({
        path: 'listing',
        select: 'title host',
      });

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found',
      });
    }

    // Make sure user is the host of the listing
    const listing = booking.listing as any;
    if (listing.host.toString() !== (req as any).user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to update this booking',
      });
    }

    booking.status = status;
    await booking.save();

    res.status(200).json({
      success: true,
      data: booking,
      message: `Booking ${status} successfully`,
    });
  } catch (error) {
    next(error);
  }
}; 