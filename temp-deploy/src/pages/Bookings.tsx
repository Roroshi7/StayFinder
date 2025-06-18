import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookings } from '../services/api';
import { Booking } from '../types';

export const Bookings = () => {
  const [userBookings, setUserBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        console.log('Fetching bookings...');
        const response = await bookings.getAll();
        console.log('Bookings response:', response);
        if (response.success) {
          console.log('Bookings data:', response.data);
          setUserBookings(response.data);
        }
      } catch (err: any) {
        console.error('Error fetching bookings:', err);
        setError(err.response?.data?.error || 'Failed to load bookings');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: Booking['status']) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCancel = async (bookingId: string) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await bookings.delete(bookingId);
      setUserBookings((prev) => prev.filter((b) => b._id !== bookingId));
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to cancel booking');
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
        <h1 className="text-3xl font-bold text-gray-900">Your Bookings</h1>

        {userBookings.length === 0 ? (
          <div className="mt-8 text-center">
            <p className="text-gray-500">You haven't made any bookings yet.</p>
            <Link
              to="/listings"
              className="mt-4 inline-block text-primary-600 hover:text-primary-500"
            >
              Browse available listings
            </Link>
          </div>
        ) : (
          <div className="mt-8 space-y-6">
            {userBookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-white shadow rounded-lg overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">
                        {booking.listing?.title || 'Listing not available'}
                      </h2>
                      <p className="mt-1 text-sm text-gray-500">
                        {booking.listing?.location?.city && booking.listing?.location?.country
                          ? `${booking.listing.location.city}, ${booking.listing.location.country}`
                          : 'Location not available'}
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

                  <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
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
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div>
                      <span className="text-sm text-gray-500">Total Price</span>
                      <p className="mt-1 text-lg font-semibold text-gray-900">
                        ₹{booking.totalPrice}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {booking.listing?._id ? (
                        <Link
                          to={`/listings/${booking.listing._id}`}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200"
                        >
                          View Listing
                        </Link>
                      ) : (
                        <span className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-400 bg-gray-100 cursor-not-allowed">
                          Listing Unavailable
                        </span>
                      )}
                      <button
                        onClick={() => handleCancel(booking._id)}
                        disabled={booking.status === 'cancelled'}
                        className={`inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md transition-colors duration-200
                          ${booking.status === 'cancelled'
                            ? 'bg-gray-200 text-gray-400 border-gray-200 cursor-not-allowed'
                            : 'bg-red-100 text-red-700 border-red-200 hover:bg-red-200'}
                        `}
                      >
                        {booking.status === 'cancelled' ? 'Cancelled' : 'Cancel Booking'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}; 