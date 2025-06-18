import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { listings, bookings } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { MapComponent } from '../components/Map';
import { PaymentModal } from '../components/PaymentModal';
import { Listing } from '../types';

const bookingSchema = z.object({
  checkIn: z.string().min(1, 'Check-in date is required'),
  checkOut: z.string().min(1, 'Check-out date is required'),
  guests: z.number().min(1, 'At least 1 guest is required'),
});

type BookingFormData = z.infer<typeof bookingSchema>;

export const ListingDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [pendingBooking, setPendingBooking] = useState<BookingFormData | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      guests: 1,
    },
  });

  const checkIn = watch('checkIn');
  const checkOut = watch('checkOut');

  useEffect(() => {
    const fetchListing = async () => {
      try {
        if (!id) return;
        const response = await listings.getById(id);
        if (response.success) {
          setListing(response.data);
        }
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to load listing details');
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  const calculateTotalPrice = () => {
    if (!listing || !checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const nights = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return nights * listing.price;
  };

  const onSubmit = async (data: BookingFormData) => {
    if (!listing || !user) return;
    setBookingError(null);
    setPendingBooking(data);
    setShowPayment(true);
  };

  const handlePaymentSuccess = async () => {
    if (!listing || !pendingBooking) return;
    try {
      console.log('Creating booking with data:', {
        listing: listing._id,
        checkIn: pendingBooking.checkIn,
        checkOut: pendingBooking.checkOut,
        guests: pendingBooking.guests,
      });
      
      const response = await bookings.create({
        listing: listing._id,
        checkIn: pendingBooking.checkIn,
        checkOut: pendingBooking.checkOut,
        guests: pendingBooking.guests,
      });
      
      console.log('Booking creation response:', response);
      
      if (response.success) {
        setShowPayment(false);
        setPendingBooking(null);
        navigate('/bookings');
      } else {
        setBookingError('Booking failed. Please try again.');
      }
    } catch (err: any) {
      console.error('Booking creation error:', err);
      setBookingError(err.response?.data?.error || 'Failed to create booking');
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (error || !listing) {
    return <div className="text-center text-red-600 py-12">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PaymentModal
        open={showPayment}
        onClose={() => setShowPayment(false)}
        onSuccess={handlePaymentSuccess}
        amount={calculateTotalPrice()}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex mb-8" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <Link to="/" className="text-gray-500 hover:text-gray-700">
                Home
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                </svg>
                <Link to="/listings" className="ml-1 text-gray-500 hover:text-gray-700 md:ml-2">
                  Listings
                </Link>
              </div>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                </svg>
                <span className="ml-1 text-gray-400 md:ml-2">{listing.title}</span>
              </div>
            </li>
          </ol>
        </nav>

        {/* Main Content */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left Column - Image Gallery and Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="relative">
                <img
                  src={listing.images[0]}
                  alt={listing.title}
                  className="w-full h-96 lg:h-[500px] object-cover rounded-2xl"
                />
                <div className="absolute top-4 right-4">
                  <button className="bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg hover:bg-white transition-colors duration-200">
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                </div>
              </div>
              {listing.images.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                  {listing.images.slice(1, 5).map((image: string, index: number) => (
                    <img
                      key={index}
                      src={image}
                      alt={`${listing.title} ${index + 2}`}
                      className="w-full h-24 object-cover rounded-xl hover:opacity-80 transition-opacity cursor-pointer"
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Property Details */}
            <div className="bg-white rounded-2xl shadow-sm p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{listing.title}</h1>
                  <p className="text-lg text-gray-600 mb-4">
                    {listing.location.city}, {listing.location.country}
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>{listing.bedrooms} {listing.bedrooms === 1 ? 'bedroom' : 'bedrooms'}</span>
                    <span>•</span>
                    <span>{listing.bathrooms} {listing.bathrooms === 1 ? 'bathroom' : 'bathrooms'}</span>
                    <span>•</span>
                    <span>Up to {listing.maxGuests} guests</span>
                  </div>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="ml-1 text-gray-600">4.8</span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">About this place</h2>
                <p className="text-gray-600 leading-relaxed">{listing.description}</p>
              </div>

              {/* Amenities */}
              {listing.amenities && listing.amenities.length > 0 && (
                <div className="border-t border-gray-200 pt-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">What this place offers</h2>
                  <div className="grid grid-cols-2 gap-4">
                    {listing.amenities.map((amenity: string, index: number) => (
                      <div key={index} className="flex items-center space-x-3">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-600">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Map Integration */}
            {listing.location?.coordinates?.lat && listing.location?.coordinates?.lng && (
              <div className="bg-white rounded-2xl shadow-sm p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Location</h3>
                <MapComponent
                  listings={[listing]}
                  height="400px"
                  showControls={false}
                />
              </div>
            )}
          </div>

          {/* Right Column - Booking Form */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <span className="text-2xl font-bold text-gray-900">₹{listing.price}</span>
                    <span className="text-gray-500">per night</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="ml-1 text-sm text-gray-600">4.8</span>
                  </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  {bookingError && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl">
                      {bookingError}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="checkIn" className="block text-sm font-medium text-gray-700 mb-1">
                        Check-in
                      </label>
                      <input
                        type="date"
                        id="checkIn"
                        {...register('checkIn')}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                      />
                      {errors.checkIn && (
                        <p className="mt-1 text-sm text-red-600">{errors.checkIn.message}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="checkOut" className="block text-sm font-medium text-gray-700 mb-1">
                        Check-out
                      </label>
                      <input
                        type="date"
                        id="checkOut"
                        {...register('checkOut')}
                        min={checkIn || new Date().toISOString().split('T')[0]}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                      />
                      {errors.checkOut && (
                        <p className="mt-1 text-sm text-red-600">{errors.checkOut.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="guests" className="block text-sm font-medium text-gray-700 mb-1">
                      Guests
                    </label>
                    <input
                      type="number"
                      id="guests"
                      min="1"
                      max={listing.maxGuests}
                      {...register('guests', { valueAsNumber: true })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                    />
                    {errors.guests && (
                      <p className="mt-1 text-sm text-red-600">{errors.guests.message}</p>
                    )}
                  </div>

                  {checkIn && checkOut && (
                    <div className="border-t border-gray-200 pt-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>₹{listing.price} × {Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24))} nights</span>
                          <span>₹{calculateTotalPrice()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Service fee</span>
                          <span>₹{Math.round(calculateTotalPrice() * 0.12)}</span>
                        </div>
                        <div className="border-t border-gray-200 pt-2">
                          <div className="flex justify-between font-semibold">
                            <span>Total</span>
                            <span>₹{calculateTotalPrice() + Math.round(calculateTotalPrice() * 0.12)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-primary-600 text-white py-4 px-6 rounded-xl font-medium hover:bg-primary-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Processing...' : 'Reserve'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 