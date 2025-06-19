# StayFinder 🏠

A full-stack Airbnb-like web application for listing and booking properties for short-term or long-term stays, built with the MERN stack (MongoDB, Express.js, React, Node.js).

Live Deployement Link:https://68539a879ad995b50699b1be--stayfinder7.netlify.app/login

## ✨ Features

### 🏠 **Property Management**
- **Property Listings** - Create, edit, and manage property listings
- **Image Upload** - Drag-and-drop image upload with preview and compression
- **Rich Property Details** - Title, description, location, amenities, pricing
- **Location Services** - City, state, country with coordinates for mapping
- **Amenities System** - WiFi, Kitchen, Pool, Gym, Pet Friendly, and more

### 🔍 **Search & Discovery**
- **Advanced Search** - Search by location, price range, guest count
- **Smart Filtering** - Filter by amenities, bedrooms, price range
- **Real-time Results** - Instant filtering and search results
- **Property Cards** - Beautiful property previews with key information

### 🗺️ **Map Integration**
- **Interactive Maps** - Mapbox integration with property markers
- **Location Visualization** - See properties on the map
- **Property Popups** - Click markers to see property details
- **Map on Listing Pages** - View property location on detail pages

### 👤 **User Authentication & Profiles**
- **Secure Registration/Login** - Email and password authentication
- **JWT Token System** - Secure token-based authentication
- **User Profiles** - Manage personal information and preferences
- **Role-based Access** - User and Host roles with different permissions
- **Profile Management** - Update name, phone, gender, address

### 📅 **Booking System**
- **Property Booking** - Reserve properties with date selection
- **Guest Management** - Specify number of guests
- **Booking History** - View all your bookings
- **Booking Cancellation** - Cancel bookings with confirmation
- **Host Approval System** - Hosts can approve/reject bookings
- **Booking Status** - Pending, confirmed, rejected, cancelled

### 🏢 **Host Dashboard**
- **Listing Management** - Create, edit, delete your listings
- **Booking Management** - View and manage bookings for your properties
- **Host Approval** - Approve or reject incoming bookings
- **Dashboard Analytics** - Overview of your listings and bookings
- **Become Host** - Upgrade from user to host role

### 💳 **Payment Integration**
- **Mock Payment System** - Stripe-like payment simulation
- **Payment Modal** - Professional payment interface
- **Card Input** - Credit card number, expiry, CVV
- **Payment Success/Failure** - Realistic payment flow simulation
- **Indian Rupees (₹)** - Localized currency display

### 🎨 **Modern UI/UX**
- **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- **Tailwind CSS** - Modern, utility-first CSS framework
- **Smooth Animations** - Hover effects, transitions, loading states
- **Professional Design** - Clean, Airbnb-inspired interface
- **Dark/Light Themes** - Consistent color scheme throughout

### 🔧 **Technical Features**
- **TypeScript** - Full type safety for better development experience
- **RESTful API** - Well-structured backend API
- **MongoDB Database** - Scalable NoSQL database
- **File Upload** - Image compression and storage
- **Error Handling** - Comprehensive error management
- **Loading States** - Professional loading indicators

## 🛠️ Tech Stack

### **Frontend**
- **React 19** - Modern React with hooks and functional components
- **TypeScript** - Type-safe JavaScript
- **React Router** - Client-side routing
- **React Hook Form** - Form management with validation
- **Zod** - Schema validation
- **Tailwind CSS** - Utility-first CSS framework
- **Mapbox** - Interactive maps integration

### **Backend**
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **TypeScript** - Type-safe backend development
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Token authentication
- **bcryptjs** - Password hashing
- **Multer** - File upload handling

### **Database**
- **MongoDB** - Document-based database
- **Mongoose ODM** - Object Document Mapper

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB (local or cloud)

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/stayfinder.git
cd stayfinder
```

### 2. Backend Setup
```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

### 3. Configure Environment Variables
Create a `.env` file in the `server` directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/stayfinder
JWT_SECRET=your_super_secret_jwt_key_here
NODE_ENV=development
```

### 4. Frontend Setup
```bash
# Navigate to client directory
cd ../client

# Install dependencies
npm install
```

### 5. Start the Application

#### Start Backend Server
```bash
# In the server directory
npm run dev
```
The backend will run on `http://localhost:5000`

#### Start Frontend Development Server
```bash
# In the client directory
npm start
```
The frontend will run on `http://localhost:3000`

### 6. Seed Sample Data (Optional)
```bash
# In the server directory
node src/scripts/addSampleListings.js
```
This will add 20 sample property listings to your database.

## 🚀 Usage

### For Users
1. **Register/Login** - Create an account or sign in
2. **Browse Properties** - Search and filter available properties
3. **View Details** - Click on properties to see full details
4. **Book Properties** - Select dates and make reservations
5. **Manage Bookings** - View and cancel your bookings
6. **Update Profile** - Manage your personal information

### For Hosts
1. **Become a Host** - Upgrade your account to host role
2. **Create Listings** - Add your properties with details and images
3. **Manage Listings** - Edit or delete your property listings
4. **Handle Bookings** - Approve or reject booking requests
5. **View Dashboard** - Overview of your hosting activity

## 📁 Project Structure

```
stayfinder/
├── client/                 # Frontend React application
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── services/      # API services
│   │   ├── types/         # TypeScript type definitions
│   │   └── utils/         # Utility functions
│   ├── package.json
│   └── tsconfig.json
├── server/                # Backend Node.js application
│   ├── src/
│   │   ├── controllers/   # Route controllers
│   │   ├── models/        # Mongoose models
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Custom middleware
│   │   ├── scripts/       # Database scripts
│   │   └── utils/         # Utility functions
│   ├── package.json
│   └── tsconfig.json
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `POST /api/auth/become-host` - Upgrade to host role

### Properties
- `GET /api/listings` - Get all properties (with filters)
- `GET /api/listings/:id` - Get specific property
- `POST /api/listings` - Create new property (host only)
- `PUT /api/listings/:id` - Update property (host only)
- `DELETE /api/listings/:id` - Delete property (host only)

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings` - Get user bookings
- `GET /api/bookings/host` - Get host bookings
- `PUT /api/bookings/:id/status` - Update booking status
- `DELETE /api/bookings/:id` - Cancel booking

## 🎯 Key Features Demo

### Property Search & Filtering
- Search by location (city, country)
- Filter by price range
- Filter by number of guests
- Filter by amenities
- Filter by number of bedrooms

### Booking System
- Select check-in and check-out dates
- Specify number of guests
- View total price calculation
- Mock payment integration
- Booking confirmation

### Host Management
- Create property listings with images
- Manage booking requests
- Approve or reject bookings
- View booking history
- Update property details

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by Airbnb's design and functionality
- Built with modern web technologies
- Special thanks to the open-source community

## 📞 Support

If you have any questions or need help with the project, please open an issue on GitHub or contact the development team.

---

**Happy coding! 🚀** 
