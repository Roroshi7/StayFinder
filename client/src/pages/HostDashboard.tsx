import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { listings, bookings } from '../services/api';
import { Listing, Booking } from '../types';
import { useAuth } from '../contexts/AuthContext';

export const HostDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'listings' | 'bookings'>('listings');
  const [hostListings, setHostListings] = useState<Listing[]>([]);
  const [hostBookings, setHostBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch listings
        const listingsResponse = await listings.getAll();
        if (listingsResponse.success) {
          const filteredListings = listingsResponse.data.filter(
            (listing) => listing.host._id === user?._id
          );
          setHostListings(filteredListings);
        }

        // Fetch bookings
        const bookingsResponse = await bookings.getHostBookings();
        if (bookingsResponse.success) {
          setHostBookings(bookingsResponse.data);
        }
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?._id]);

  const handleDeleteListing = async (listingId: string) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) {
      return;
    }

    try {
      setDeleteError(null);
      const response = await listings.delete(listingId);
      if (response.success) {
        setHostListings((prev) =>
          prev.filter((listing) => listing._id !== listingId)
        );
      }
    } catch (err: any) {
      setDeleteError(err.response?.data?.error || 'Failed to delete listing');
    }
  };

  const handleUpdateBookingStatus = async (bookingId: string, status: 'pending' | 'confirmed' | 'rejected' | 'cancelled') => {
    try {
      const response = await bookings.updateStatus(bookingId, status);
      if (response.success) {
        setHostBookings((prev) =>
          prev.map((booking) =>
            booking._id === bookingId ? { ...booking, status } : booking
          )
        );
      }
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to update booking status');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600 py-12">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Host Dashboard</h1>
          <Link
            to="/host/listings/new"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
          >
            Add New Listing
          </Link>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('listings')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'listings'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              My Listings ({hostListings.length})
            </button>
            <button
              onClick={() => setActiveTab('bookings')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'bookings'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Bookings ({hostBookings.length})
            </button>
          </nav>
        </div>

        {deleteError && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
            {deleteError}
          </div>
        )}

        {/* Listings Tab */}
        {activeTab === 'listings' && (
          <>
            {hostListings.length === 0 ? (
              <div className="text-center">
                <p className="text-gray-500">You haven't created any listings yet.</p>
                <Link
                  to="/host/listings/new"
                  className="mt-4 inline-block text-primary-600 hover:text-primary-500"
                >
                  Create your first listing
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {hostListings.map((listing) => (
                  <div
                    key={listing._id}
                    className="bg-white shadow rounded-lg overflow-hidden"
                  >
                    <div className="aspect-w-16 aspect-h-9">
                      <img
                        src={listing.images[0]}
                        alt={listing.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-6">
                      <h2 className="text-xl font-semibold text-gray-900">
                        {listing.title}
                      </h2>
                      <p className="mt-1 text-sm text-gray-500">
                        {listing.location.city}, {listing.location.country}
                      </p>
                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-lg font-bold text-gray-900">
                          ₹{listing.price}
                          <span className="text-sm font-normal text-gray-500">
                            /night
                          </span>
                        </span>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <span>{listing.bedrooms} beds</span>
                          <span>•</span>
                          <span>{listing.bathrooms} baths</span>
                        </div>
                      </div>
                      <div className="mt-6 flex items-center justify-between">
                        <Link
                          to={`/host/listings/${listing._id}/edit`}
                          className="text-primary-600 hover:text-primary-500"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDeleteListing(listing._id)}
                          className="text-red-600 hover:text-red-500"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <>
            {hostBookings.length === 0 ? (
              <div className="text-center">
                <p className="text-gray-500">No bookings for your listings yet.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {hostBookings.map((booking) => (
                  <div
                    key={booking._id}
                    className="bg-white shadow rounded-lg overflow-hidden"
                  >
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h2 className="text-xl font-semibold text-gray-900">
                            {booking.listing.title}
                          </h2>
                          <p className="mt-1 text-sm text-gray-500">
                            Booked by {booking.guest.name} ({booking.guest.email})
                          </p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                            booking.status
                          )}`}
                        >
                          {booking.status.charAt(0).toUpperCase() +
                            booking.status.slice(1)}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 mb-4">
                        <div>
                          <span className="text-sm text-gray-500">Check-in</span>
                          <p className="mt-1 text-sm font-medium text-gray-900">
                            {formatDate(booking.checkIn)}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">Check-out</span>
                          <p className="mt-1 text-sm font-medium text-gray-900">
                            {formatDate(booking.checkOut)}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">Guests</span>
                          <p className="mt-1 text-sm font-medium text-gray-900">
                            {booking.guests} {booking.guests === 1 ? 'guest' : 'guests'}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">Total Price</span>
                          <p className="mt-1 text-sm font-medium text-gray-900">
                            ₹{booking.totalPrice}
                          </p>
                        </div>
                      </div>

                      {booking.status === 'pending' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleUpdateBookingStatus(booking._id, 'confirmed')}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                          >
                            Approve Booking
                          </button>
                          <button
                            onClick={() => handleUpdateBookingStatus(booking._id, 'rejected')}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                          >
                            Reject Booking
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}; 