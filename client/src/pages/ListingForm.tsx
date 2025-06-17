import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { listings } from '../services/api';
import { Listing } from '../types';

const listingSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  location: z.object({
    address: z.string().min(1, 'Address is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    country: z.string().min(1, 'Country is required'),
    coordinates: z.object({
      lat: z.number(),
      lng: z.number(),
    }),
  }),
  price: z.number().min(1, 'Price must be greater than 0'),
  images: z.array(z.string()).min(1, 'At least one image is required'),
  amenities: z.array(z.string()),
  maxGuests: z.number().min(1, 'Maximum guests must be at least 1'),
  bedrooms: z.number().min(1, 'Number of bedrooms must be at least 1'),
  bathrooms: z.number().min(1, 'Number of bathrooms must be at least 1'),
});

type ListingFormData = z.infer<typeof listingSchema>;

const AMENITIES = [
  'WiFi',
  'Kitchen',
  'Washer',
  'Dryer',
  'Air Conditioning',
  'Heating',
  'TV',
  'Pool',
  'Hot Tub',
  'Free Parking',
  'Gym',
  'Elevator',
  'Indoor Fireplace',
  'Breakfast',
  'Workspace',
  'Pets Allowed',
  'Family Friendly',
  'Smoking Allowed',
  'Wheelchair Accessible',
  'Beach Access',
];

export const ListingForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ListingFormData>({
    resolver: zodResolver(listingSchema),
    defaultValues: {
      amenities: [],
      images: [],
      maxGuests: 1,
      bedrooms: 1,
      bathrooms: 1,
    },
  });

  useEffect(() => {
    const fetchListing = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const response = await listings.getById(id);
        if (response.success) {
          const listing = response.data;
          setValue('title', listing.title);
          setValue('description', listing.description);
          setValue('location', listing.location);
          setValue('price', listing.price);
          setValue('amenities', listing.amenities);
          setValue('maxGuests', listing.maxGuests);
          setValue('bedrooms', listing.bedrooms);
          setValue('bathrooms', listing.bathrooms);
          setImageUrls(listing.images);
          setValue('images', listing.images);
        }
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to load listing');
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id, setValue]);

  const handleAddImage = () => {
    if (newImageUrl && !imageUrls.includes(newImageUrl)) {
      const updatedUrls = [...imageUrls, newImageUrl];
      setImageUrls(updatedUrls);
      setValue('images', updatedUrls);
      setNewImageUrl('');
    }
  };

  const handleRemoveImage = (index: number) => {
    const updatedUrls = imageUrls.filter((_, i) => i !== index);
    setImageUrls(updatedUrls);
    setValue('images', updatedUrls);
  };

  const handleAmenityChange = (amenity: string) => {
    const currentAmenities = watch('amenities') as string[];
    const updatedAmenities = currentAmenities.includes(amenity)
      ? currentAmenities.filter((a: string) => a !== amenity)
      : [...currentAmenities, amenity];
    setValue('amenities', updatedAmenities);
  };

  const onSubmit = async (data: ListingFormData) => {
    try {
      setError(null);
      if (id) {
        const response = await listings.update(id, data);
        if (response.success) {
          navigate('/host/dashboard');
        }
      } else {
        const response = await listings.create(data);
        if (response.success) {
          navigate('/host/dashboard');
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to save listing');
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {id ? 'Edit Listing' : 'Create New Listing'}
        </h1>

        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              {...register('title')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <textarea
              id="description"
              rows={4}
              {...register('description')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700"
              >
                Address
              </label>
              <input
                type="text"
                id="address"
                {...register('location.address')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              />
              {errors.location?.address && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.location.address.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="city"
                className="block text-sm font-medium text-gray-700"
              >
                City
              </label>
              <input
                type="text"
                id="city"
                {...register('location.city')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              />
              {errors.location?.city && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.location.city.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="state"
                className="block text-sm font-medium text-gray-700"
              >
                State
              </label>
              <input
                type="text"
                id="state"
                {...register('location.state')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              />
              {errors.location?.state && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.location.state.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="country"
                className="block text-sm font-medium text-gray-700"
              >
                Country
              </label>
              <input
                type="text"
                id="country"
                {...register('location.country')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              />
              {errors.location?.country && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.location.country.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label
                htmlFor="price"
                className="block text-sm font-medium text-gray-700"
              >
                Price per night
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">₹</span>
                </div>
                <input
                  type="number"
                  id="price"
                  {...register('price', { valueAsNumber: true })}
                  className="pl-7 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
              </div>
              {errors.price && (
                <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="maxGuests"
                className="block text-sm font-medium text-gray-700"
              >
                Maximum guests
              </label>
              <input
                type="number"
                id="maxGuests"
                {...register('maxGuests', { valueAsNumber: true })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              />
              {errors.maxGuests && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.maxGuests.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="bedrooms"
                className="block text-sm font-medium text-gray-700"
              >
                Bedrooms
              </label>
              <input
                type="number"
                id="bedrooms"
                {...register('bedrooms', { valueAsNumber: true })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              />
              {errors.bedrooms && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.bedrooms.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="bathrooms"
                className="block text-sm font-medium text-gray-700"
              >
                Bathrooms
              </label>
              <input
                type="number"
                id="bathrooms"
                {...register('bathrooms', { valueAsNumber: true })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              />
              {errors.bathrooms && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.bathrooms.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Images
            </label>
            <div className="mt-1">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="Enter image URL"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
                <button
                  type="button"
                  onClick={handleAddImage}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                >
                  Add
                </button>
              </div>
              {errors.images && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.images.message}
                </p>
              )}
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
              {imageUrls.map((url, index) => (
                <div key={index} className="relative">
                  <img
                    src={url}
                    alt={`Listing ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Amenities
            </label>
            <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {AMENITIES.map((amenity) => (
                <div key={amenity} className="flex items-center">
                  <input
                    type="checkbox"
                    id={amenity}
                    value={amenity}
                    {...register('amenities')}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor={amenity}
                    className="ml-2 text-sm text-gray-700"
                  >
                    {amenity}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/host/dashboard')}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              {isSubmitting ? 'Saving...' : 'Save Listing'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}; 