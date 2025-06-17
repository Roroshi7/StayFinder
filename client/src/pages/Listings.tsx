import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { listings } from '../services/api';
import { Listing } from '../types';

export const Listings = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [allListings, setAllListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    location: searchParams.get('location') || '',
    guests: searchParams.get('guests') || '',
    checkIn: searchParams.get('checkIn') || '',
    checkOut: searchParams.get('checkOut') || '',
    amenities: searchParams.get('amenities')?.split(',') || [],
    bedrooms: searchParams.get('bedrooms') || '',
  });

  const amenityOptions = [
    'WiFi', 'Kitchen', 'Air Conditioning', 'Heating', 'TV', 'Parking', 
    'Pool', 'Gym', 'Pet Friendly', 'Balcony', 'Garden', 'Workspace'
  ];

  // Get max price from listings for dynamic range
  const maxPriceFromListings = Math.max(...allListings.map(l => l.price), 0);
  const maxPriceRange = Math.max(maxPriceFromListings, 12000); // Default to 12000 if no listings

  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        const response = await listings.getAll();
        if (response.success) {
          setAllListings(response.data);
        }
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to load listings');
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleAmenityChange = (amenity: string) => {
    setFilters((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const clearFilters = () => {
    setFilters({
      minPrice: '',
      maxPrice: '',
      location: '',
      guests: '',
      checkIn: '',
      checkOut: '',
      amenities: [],
      bedrooms: '',
    });
    setSearchParams({});
  };

  const filteredListings = allListings.filter((listing) => {
    const matchesPrice =
      (!filters.minPrice || listing.price >= Number(filters.minPrice)) &&
      (!filters.maxPrice || listing.price <= Number(filters.maxPrice));
    
    const matchesLocation =
      !filters.location ||
      listing.location.city.toLowerCase().includes(filters.location.toLowerCase()) ||
      listing.location.country.toLowerCase().includes(filters.location.toLowerCase()) ||
      listing.location.address.toLowerCase().includes(filters.location.toLowerCase());
    
    const matchesGuests =
      !filters.guests || listing.maxGuests >= Number(filters.guests);

    const matchesBedrooms =
      !filters.bedrooms || listing.bedrooms >= Number(filters.bedrooms);

    const matchesAmenities =
      filters.amenities.length === 0 ||
      filters.amenities.every(amenity => listing.amenities.includes(amenity));

    return matchesPrice && matchesLocation && matchesGuests && matchesBedrooms && matchesAmenities;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Find your perfect stay</h1>
          <p className="text-lg text-gray-600">Discover unique places to stay around the world</p>
        </div>

        {/* Search and Filters Bar */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                name="location"
                placeholder="Search destinations..."
                value={filters.location}
                onChange={handleFilterChange}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
              />
            </div>

            {/* Check-in Date */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <input
                type="date"
                name="checkIn"
                value={filters.checkIn}
                onChange={handleFilterChange}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
              />
            </div>

            {/* Guests */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <select
                name="guests"
                value={filters.guests}
                onChange={handleFilterChange}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors appearance-none bg-white"
              >
                <option value="">Any guests</option>
                <option value="1">1 guest</option>
                <option value="2">2 guests</option>
                <option value="3">3 guests</option>
                <option value="4">4 guests</option>
                <option value="5">5 guests</option>
                <option value="6">6 guests</option>
                <option value="7">7 guests</option>
                <option value="8">8 guests</option>
                <option value="9">9 guests</option>
                <option value="10">10 guests</option>
              </select>
            </div>

            {/* Clear Filters */}
            <button
              onClick={clearFilters}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors duration-200 font-medium"
            >
              Clear filters
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
              
              {/* Price Range Filter */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Price range</h4>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className="block text-xs text-gray-500 mb-1">Min Price</label>
                      <input
                        type="number"
                        name="minPrice"
                        placeholder="0"
                        value={filters.minPrice}
                        onChange={handleFilterChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs text-gray-500 mb-1">Max Price</label>
                      <input
                        type="number"
                        name="maxPrice"
                        placeholder={maxPriceRange.toString()}
                        value={filters.maxPrice}
                        onChange={handleFilterChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 text-center">
                    {filters.minPrice && filters.maxPrice 
                      ? `₹${filters.minPrice} - ₹${filters.maxPrice}`
                      : filters.minPrice 
                        ? `₹${filters.minPrice}+`
                        : filters.maxPrice 
                          ? `Up to ₹${filters.maxPrice}`
                          : 'Any price'
                    }
                  </div>
                </div>
              </div>

              {/* Amenities Filter */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Amenities</h4>
                <div className="space-y-2">
                  {amenityOptions.map((amenity) => (
                    <label key={amenity} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.amenities.includes(amenity)}
                        onChange={() => handleAmenityChange(amenity)}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-600">{amenity}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Bedrooms Filter */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Bedrooms</h4>
                <div className="grid grid-cols-2 gap-2">
                  {[1, 2, 3, 4, '5+'].map((num) => (
                    <button
                      key={num}
                      onClick={() => setFilters((prev) => ({ ...prev, bedrooms: num === '5+' ? '5' : String(num) }))}
                      className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                        filters.bedrooms === String(num)
                          ? 'bg-primary-600 text-white border-primary-600'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-primary-300'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Listings Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl shadow-sm overflow-hidden animate-pulse">
                    <div className="h-64 bg-gray-200"></div>
                    <div className="p-6 space-y-4">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="text-red-600 text-lg font-medium mb-4">{error}</div>
                <button
                  onClick={() => window.location.reload()}
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  Try again
                </button>
              </div>
            ) : filteredListings.length === 0 ? (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No listings found</h3>
                <p className="mt-1 text-sm text-gray-500">Try adjusting your filters or search terms.</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-6">
                  <p className="text-gray-600">
                    {filteredListings.length} {filteredListings.length === 1 ? 'listing' : 'listings'} found
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredListings.map((listing) => (
                    <Link
                      key={listing._id}
                      to={`/listings/${listing._id}`}
                      className="group block"
                    >
                      <div className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                        <div className="relative">
                          <img
                            src={listing.images[0]}
                            alt={listing.title}
                            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute top-4 right-4">
                            <button className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-white transition-colors duration-200">
                              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                              </svg>
                            </button>
                          </div>
                          <div className="absolute bottom-4 left-4">
                            <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1 shadow-lg">
                              <span className="text-sm font-semibold text-gray-900">
                                ₹{listing.price}
                                <span className="text-gray-500 font-normal"> /night</span>
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="p-6">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="text-xl font-semibold text-gray-900 group-hover:text-primary-600 transition-colors duration-200 line-clamp-1">
                              {listing.title}
                            </h3>
                            <div className="flex items-center">
                              <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                              <span className="text-sm text-gray-600 ml-1">4.8</span>
                            </div>
                          </div>
                          <p className="text-gray-500 mb-3">
                            {listing.location.city}, {listing.location.country}
                          </p>
                          <div className="flex items-center justify-between text-sm text-gray-500">
                            <span>{listing.bedrooms} {listing.bedrooms === 1 ? 'bedroom' : 'bedrooms'}</span>
                            <span>•</span>
                            <span>{listing.bathrooms} {listing.bathrooms === 1 ? 'bathroom' : 'bathrooms'}</span>
                            <span>•</span>
                            <span>Up to {listing.maxGuests} guests</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}; 