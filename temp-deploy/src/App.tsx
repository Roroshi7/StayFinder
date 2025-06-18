import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Home } from './pages/Home';
import Login from './pages/Login';
import { Register } from './pages/Register';
import { Listings } from './pages/Listings';
import { ListingDetail } from './pages/ListingDetail';
import { Bookings } from './pages/Bookings';
import { HostDashboard } from './pages/HostDashboard';
import { HostListingForm } from './pages/HostListingForm';
import { Profile } from './pages/Profile';
import { BecomeHost } from './pages/BecomeHost';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/listings" element={<Listings />} />
            <Route path="/listings/:id" element={<ListingDetail />} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/bookings" element={<ProtectedRoute><Bookings /></ProtectedRoute>} />
            <Route path="/host/dashboard" element={<ProtectedRoute><HostDashboard /></ProtectedRoute>} />
            <Route path="/host/listings/new" element={<ProtectedRoute><HostListingForm /></ProtectedRoute>} />
            <Route path="/host/listings/:id/edit" element={<ProtectedRoute requiredRole="host"><HostListingForm /></ProtectedRoute>} />
            <Route path="/become-host" element={<ProtectedRoute><BecomeHost /></ProtectedRoute>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
