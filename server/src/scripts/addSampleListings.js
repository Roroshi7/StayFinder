const mongoose = require('mongoose');
require('dotenv').config();

// Define the Listing schema inline since we can't import TypeScript models directly
const listingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    coordinates: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true }
    }
  },
  price: { type: Number, required: true },
  images: [{ type: String }],
  amenities: [{ type: String }],
  maxGuests: { type: Number, required: true },
  bedrooms: { type: Number, required: true },
  bathrooms: { type: Number, required: true },
  host: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, {
  timestamps: true
});

const Listing = mongoose.model('Listing', listingSchema);

// Define User schema inline
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'host'], default: 'user' },
  phone: String,
  gender: String,
  alternateEmail: String,
  address: {
    street: String,
    city: String,
    state: String,
    country: String,
    zipCode: String
  }
}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema);

const sampleListings = [
  {
    title: "Luxury Villa in Goa",
    description: "Beautiful beachfront villa with private pool, stunning ocean views, and modern amenities. Perfect for a relaxing getaway in Goa.",
    location: {
      address: "Candolim Beach Road",
      city: "Goa",
      state: "Goa",
      country: "India",
      coordinates: { lat: 15.5193, lng: 73.7625 }
    },
    price: 8500,
    images: [
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop"
    ],
    amenities: ["Pool", "Beach Access", "WiFi", "Kitchen", "Air Conditioning", "Free Parking"],
    maxGuests: 6,
    bedrooms: 3,
    bathrooms: 2
  },
  {
    title: "Cozy Mountain Cabin in Manali",
    description: "Rustic wooden cabin nestled in the Himalayas with breathtaking mountain views. Perfect for nature lovers and adventure seekers.",
    location: {
      address: "Old Manali",
      city: "Manali",
      state: "Himachal Pradesh",
      country: "India",
      coordinates: { lat: 32.2432, lng: 77.1892 }
    },
    price: 3200,
    images: [
      "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop"
    ],
    amenities: ["Indoor Fireplace", "Mountain View", "WiFi", "Kitchen", "Heating", "Free Parking"],
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 1
  },
  {
    title: "Modern Apartment in Mumbai",
    description: "Sleek 2-bedroom apartment in the heart of Mumbai with city views, modern furnishings, and all amenities for a comfortable stay.",
    location: {
      address: "Bandra West",
      city: "Mumbai",
      state: "Maharashtra",
      country: "India",
      coordinates: { lat: 19.0596, lng: 72.8295 }
    },
    price: 4500,
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop"
    ],
    amenities: ["WiFi", "Kitchen", "Air Conditioning", "TV", "Elevator", "Gym"],
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 2
  },
  {
    title: "Heritage Haveli in Jaipur",
    description: "Stunning 18th-century haveli restored with modern comforts while preserving its royal heritage. Experience the pink city in style.",
    location: {
      address: "C-Scheme",
      city: "Jaipur",
      state: "Rajasthan",
      country: "India",
      coordinates: { lat: 26.9124, lng: 75.7873 }
    },
    price: 6800,
    images: [
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop"
    ],
    amenities: ["Indoor Fireplace", "WiFi", "Kitchen", "Air Conditioning", "Breakfast", "Workspace"],
    maxGuests: 6,
    bedrooms: 3,
    bathrooms: 2
  },
  {
    title: "Beach House in Kerala",
    description: "Traditional Kerala-style beach house with private beach access, Ayurvedic spa, and authentic local cuisine experience.",
    location: {
      address: "Kovalam Beach",
      city: "Thiruvananthapuram",
      state: "Kerala",
      country: "India",
      coordinates: { lat: 8.4004, lng: 76.9797 }
    },
    price: 5200,
    images: [
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop"
    ],
    amenities: ["Beach Access", "WiFi", "Kitchen", "Air Conditioning", "Breakfast", "Hot Tub"],
    maxGuests: 5,
    bedrooms: 2,
    bathrooms: 2
  },
  {
    title: "Treehouse in Coorg",
    description: "Unique treehouse experience in the coffee plantations of Coorg. Wake up to the sounds of nature and enjoy panoramic views.",
    location: {
      address: "Madikeri",
      city: "Coorg",
      state: "Karnataka",
      country: "India",
      coordinates: { lat: 12.4207, lng: 75.7397 }
    },
    price: 2800,
    images: [
      "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop"
    ],
    amenities: ["Mountain View", "WiFi", "Kitchen", "Breakfast", "Free Parking", "Family Friendly"],
    maxGuests: 3,
    bedrooms: 1,
    bathrooms: 1
  },
  {
    title: "Luxury Penthouse in Delhi",
    description: "Ultra-modern penthouse with panoramic city views, rooftop terrace, and premium amenities in the heart of Delhi.",
    location: {
      address: "Connaught Place",
      city: "Delhi",
      state: "Delhi",
      country: "India",
      coordinates: { lat: 28.6139, lng: 77.2090 }
    },
    price: 12000,
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop"
    ],
    amenities: ["Pool", "WiFi", "Kitchen", "Air Conditioning", "TV", "Gym", "Elevator"],
    maxGuests: 8,
    bedrooms: 4,
    bathrooms: 3
  },
  {
    title: "Desert Camp in Jaisalmer",
    description: "Authentic desert camping experience with traditional Rajasthani hospitality, camel rides, and stargazing under the desert sky.",
    location: {
      address: "Sam Sand Dunes",
      city: "Jaisalmer",
      state: "Rajasthan",
      country: "India",
      coordinates: { lat: 26.9157, lng: 70.9083 }
    },
    price: 3800,
    images: [
      "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop"
    ],
    amenities: ["Breakfast", "WiFi", "Free Parking", "Family Friendly", "Workspace"],
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 1
  },
  {
    title: "Lake View Cottage in Udaipur",
    description: "Charming cottage overlooking Lake Pichola with traditional architecture, boat rides, and romantic sunset views.",
    location: {
      address: "Lake Palace Road",
      city: "Udaipur",
      state: "Rajasthan",
      country: "India",
      coordinates: { lat: 24.5854, lng: 73.7125 }
    },
    price: 5500,
    images: [
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop"
    ],
    amenities: ["Lake View", "WiFi", "Kitchen", "Air Conditioning", "Breakfast", "Free Parking"],
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 1
  },
  {
    title: "Hill Station Bungalow in Ooty",
    description: "Colonial-style bungalow in the Nilgiri Hills with tea garden views, fireplace, and perfect weather year-round.",
    location: {
      address: "Botanical Gardens Road",
      city: "Ooty",
      state: "Tamil Nadu",
      country: "India",
      coordinates: { lat: 11.4102, lng: 76.6950 }
    },
    price: 4200,
    images: [
      "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop"
    ],
    amenities: ["Mountain View", "Indoor Fireplace", "WiFi", "Kitchen", "Heating", "Breakfast"],
    maxGuests: 5,
    bedrooms: 2,
    bathrooms: 2
  },
  {
    title: "Modern Studio in Bangalore",
    description: "Contemporary studio apartment in tech hub Bangalore with smart home features, workspace, and city center access.",
    location: {
      address: "Indiranagar",
      city: "Bangalore",
      state: "Karnataka",
      country: "India",
      coordinates: { lat: 12.9716, lng: 77.5946 }
    },
    price: 2800,
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop"
    ],
    amenities: ["WiFi", "Kitchen", "Air Conditioning", "TV", "Workspace", "Gym"],
    maxGuests: 2,
    bedrooms: 1,
    bathrooms: 1
  },
  {
    title: "Riverside Cottage in Rishikesh",
    description: "Peaceful cottage by the Ganges with yoga classes, meditation sessions, and adventure activities like rafting and trekking.",
    location: {
      address: "Laxman Jhula",
      city: "Rishikesh",
      state: "Uttarakhand",
      country: "India",
      coordinates: { lat: 30.0869, lng: 78.2676 }
    },
    price: 2200,
    images: [
      "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop"
    ],
    amenities: ["River View", "WiFi", "Kitchen", "Breakfast", "Free Parking", "Family Friendly"],
    maxGuests: 3,
    bedrooms: 1,
    bathrooms: 1
  },
  {
    title: "Luxury Resort Villa in Agra",
    description: "Premium villa with Taj Mahal views, infinity pool, spa services, and world-class dining experience.",
    location: {
      address: "Taj East Gate Road",
      city: "Agra",
      state: "Uttar Pradesh",
      country: "India",
      coordinates: { lat: 27.1751, lng: 78.0421 }
    },
    price: 9500,
    images: [
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop"
    ],
    amenities: ["Pool", "WiFi", "Kitchen", "Air Conditioning", "TV", "Gym", "Breakfast"],
    maxGuests: 6,
    bedrooms: 3,
    bathrooms: 3
  },
  {
    title: "Backpacker Hostel in Varanasi",
    description: "Budget-friendly hostel in the spiritual capital with rooftop views of the Ganges, cultural activities, and local food tours.",
    location: {
      address: "Dashashwamedh Ghat",
      city: "Varanasi",
      state: "Uttar Pradesh",
      country: "India",
      coordinates: { lat: 25.3176, lng: 82.9739 }
    },
    price: 800,
    images: [
      "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop"
    ],
    amenities: ["WiFi", "Kitchen", "Breakfast", "Free Parking", "Family Friendly"],
    maxGuests: 8,
    bedrooms: 4,
    bathrooms: 2
  },
  {
    title: "Tea Estate Bungalow in Darjeeling",
    description: "Historic bungalow in a working tea estate with mountain views, tea tasting sessions, and guided estate tours.",
    location: {
      address: "Lebong",
      city: "Darjeeling",
      state: "West Bengal",
      country: "India",
      coordinates: { lat: 27.0360, lng: 88.2627 }
    },
    price: 4800,
    images: [
      "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop"
    ],
    amenities: ["Mountain View", "Indoor Fireplace", "WiFi", "Kitchen", "Heating", "Breakfast"],
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 1
  },
  {
    title: "Beach Resort in Andaman",
    description: "Exotic beach resort with private beach access, water sports, coral reef snorkeling, and tropical island experience.",
    location: {
      address: "Havelock Island",
      city: "Port Blair",
      state: "Andaman and Nicobar",
      country: "India",
      coordinates: { lat: 11.7401, lng: 92.6586 }
    },
    price: 7800,
    images: [
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop"
    ],
    amenities: ["Beach Access", "Pool", "WiFi", "Kitchen", "Air Conditioning", "Free Parking"],
    maxGuests: 6,
    bedrooms: 3,
    bathrooms: 2
  },
  {
    title: "Heritage Palace in Mysore",
    description: "Royal palace experience with traditional architecture, cultural performances, and authentic South Indian hospitality.",
    location: {
      address: "Palace Road",
      city: "Mysore",
      state: "Karnataka",
      country: "India",
      coordinates: { lat: 12.2958, lng: 76.6394 }
    },
    price: 6500,
    images: [
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop"
    ],
    amenities: ["WiFi", "Kitchen", "Air Conditioning", "Breakfast", "Workspace", "Free Parking"],
    maxGuests: 8,
    bedrooms: 4,
    bathrooms: 3
  },
  {
    title: "Adventure Camp in Ladakh",
    description: "High-altitude adventure camp with mountain biking, trekking, and cultural experiences in the stunning Ladakh region.",
    location: {
      address: "Leh",
      city: "Leh",
      state: "Ladakh",
      country: "India",
      coordinates: { lat: 34.1526, lng: 77.5771 }
    },
    price: 3500,
    images: [
      "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop"
    ],
    amenities: ["Mountain View", "WiFi", "Kitchen", "Breakfast", "Free Parking", "Family Friendly"],
    maxGuests: 6,
    bedrooms: 3,
    bathrooms: 2
  },
  {
    title: "Lakeside Villa in Nainital",
    description: "Beautiful villa overlooking Naini Lake with boat rides, mountain views, and peaceful atmosphere in the Kumaon hills.",
    location: {
      address: "Mallital",
      city: "Nainital",
      state: "Uttarakhand",
      country: "India",
      coordinates: { lat: 29.3919, lng: 79.4542 }
    },
    price: 4200,
    images: [
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop"
    ],
    amenities: ["Lake View", "WiFi", "Kitchen", "Heating", "Breakfast", "Free Parking"],
    maxGuests: 5,
    bedrooms: 2,
    bathrooms: 2
  },
  {
    title: "Modern Loft in Hyderabad",
    description: "Contemporary loft apartment in the IT hub with modern amenities, city views, and proximity to tech parks and malls.",
    location: {
      address: "Hitech City",
      city: "Hyderabad",
      state: "Telangana",
      country: "India",
      coordinates: { lat: 17.3850, lng: 78.4867 }
    },
    price: 3800,
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop"
    ],
    amenities: ["WiFi", "Kitchen", "Air Conditioning", "TV", "Workspace", "Gym", "Elevator"],
    maxGuests: 3,
    bedrooms: 1,
    bathrooms: 1
  }
];

async function addSampleListings() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/stayfinder');
    console.log('Connected to MongoDB');

    // Get a host user (assuming there's at least one host user)
    const hostUser = await User.findOne({ role: 'host' });
    if (!hostUser) {
      console.log('No host user found. Creating a sample host user...');
      const sampleHost = new User({
        name: 'Sample Host',
        email: 'host@stayfinder.com',
        password: 'password123',
        role: 'host'
      });
      await sampleHost.save();
      console.log('Sample host user created');
    }

    const host = hostUser || await User.findOne({ role: 'host' });

    // Add host ID to each listing
    const listingsWithHost = sampleListings.map(listing => ({
      ...listing,
      host: host._id
    }));

    // Insert all listings
    const result = await Listing.insertMany(listingsWithHost);
    console.log(`Successfully added ${result.length} sample listings`);

    // Close connection
    await mongoose.connection.close();
    console.log('Database connection closed');

  } catch (error) {
    console.error('Error adding sample listings:', error);
    process.exit(1);
  }
}

// Run the script
addSampleListings(); 