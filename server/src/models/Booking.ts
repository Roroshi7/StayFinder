import mongoose from 'mongoose';

export interface IBooking extends mongoose.Document {
  listing: mongoose.Types.ObjectId;
  guest: mongoose.Types.ObjectId;
  checkIn: Date;
  checkOut: Date;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'rejected';
  guests: number;
  createdAt: Date;
}

const bookingSchema = new mongoose.Schema(
  {
    listing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Listing',
      required: true,
    },
    guest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    checkIn: {
      type: Date,
      required: [true, 'Please add check-in date'],
    },
    checkOut: {
      type: Date,
      required: [true, 'Please add check-out date'],
    },
    totalPrice: {
      type: Number,
      required: [true, 'Please add total price'],
      min: [0, 'Total price must be a positive number'],
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'rejected'],
      default: 'pending',
    },
    guests: {
      type: Number,
      required: [true, 'Please add number of guests'],
      min: [1, 'Number of guests must be at least 1'],
    },
  },
  {
    timestamps: true,
  }
);

// Prevent double booking
bookingSchema.index(
  { listing: 1, checkIn: 1, checkOut: 1 },
  { unique: true }
);

export const Booking = mongoose.model<IBooking>('Booking', bookingSchema); 