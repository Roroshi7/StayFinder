import mongoose from 'mongoose';

export interface IListing extends mongoose.Document {
  title: string;
  description: string;
  location: {
    address: string;
    city: string;
    state: string;
    country: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  price: number;
  images: string[];
  amenities: string[];
  host: mongoose.Types.ObjectId;
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  createdAt: Date;
}

const listingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
      maxlength: [1000, 'Description cannot be more than 1000 characters'],
    },
    location: {
      address: {
        type: String,
        required: [true, 'Please add an address'],
      },
      city: {
        type: String,
        required: [true, 'Please add a city'],
      },
      state: {
        type: String,
        required: [true, 'Please add a state'],
      },
      country: {
        type: String,
        required: [true, 'Please add a country'],
      },
      coordinates: {
        lat: {
          type: Number,
          required: [true, 'Please add latitude'],
        },
        lng: {
          type: Number,
          required: [true, 'Please add longitude'],
        },
      },
    },
    price: {
      type: Number,
      required: [true, 'Please add a price'],
      min: [0, 'Price must be a positive number'],
    },
    images: [{
      type: String,
      required: [true, 'Please add at least one image'],
    }],
    amenities: [{
      type: String,
    }],
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    maxGuests: {
      type: Number,
      required: [true, 'Please add maximum number of guests'],
      min: [1, 'Maximum guests must be at least 1'],
    },
    bedrooms: {
      type: Number,
      required: [true, 'Please add number of bedrooms'],
      min: [0, 'Number of bedrooms must be a positive number'],
    },
    bathrooms: {
      type: Number,
      required: [true, 'Please add number of bathrooms'],
      min: [0, 'Number of bathrooms must be a positive number'],
    },
  },
  {
    timestamps: true,
  }
);

// Create index for location search
listingSchema.index({ 'location.coordinates': '2dsphere' });

export const Listing = mongoose.model<IListing>('Listing', listingSchema); 