import { Request, Response, NextFunction } from 'express';
import { Listing } from '../models/Listing';

// @desc    Get all listings
// @route   GET /api/listings
// @access  Public
export const getListings = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { location, minPrice, maxPrice, guests, amenities } = req.query;
    const query: any = {};

    if (location) {
      query.$or = [
        { 'location.city': { $regex: location, $options: 'i' } },
        { 'location.country': { $regex: location, $options: 'i' } },
        { 'location.address': { $regex: location, $options: 'i' } },
      ];
    }
    if (minPrice) {
      query.price = { ...query.price, $gte: Number(minPrice) };
    }
    if (maxPrice) {
      query.price = { ...query.price, $lte: Number(maxPrice) };
    }
    if (guests) {
      query.maxGuests = { $gte: Number(guests) };
    }
    if (amenities) {
      const amenitiesArray = Array.isArray(amenities)
        ? amenities
        : (amenities as string).split(',');
      query.amenities = { $all: amenitiesArray };
    }

    const listings = await Listing.find(query).populate('host', 'name email');

    res.status(200).json({
      success: true,
      count: listings.length,
      data: listings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single listing
// @route   GET /api/listings/:id
// @access  Public
export const getListing = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const listing = await Listing.findById(req.params.id).populate(
      'host',
      'name email'
    );

    if (!listing) {
      return res.status(404).json({
        success: false,
        error: 'Listing not found',
      });
    }

    res.status(200).json({
      success: true,
      data: listing,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new listing
// @route   POST /api/listings
// @access  Private (host only)
export const createListing = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Add user to req.body
    req.body.host = (req as any).user.id;

    const listing = await Listing.create(req.body);

    res.status(201).json({
      success: true,
      data: listing,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update listing
// @route   PUT /api/listings/:id
// @access  Private (host only)
export const updateListing = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({
        success: false,
        error: 'Listing not found',
      });
    }

    // Make sure user is listing owner
    if (listing.host.toString() !== (req as any).user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to update this listing',
      });
    }

    listing = await Listing.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: listing,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete listing
// @route   DELETE /api/listings/:id
// @access  Private (host only)
export const deleteListing = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({
        success: false,
        error: 'Listing not found',
      });
    }

    // Make sure user is listing owner
    if (listing.host.toString() !== (req as any).user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to delete this listing',
      });
    }

    await Listing.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
}; 