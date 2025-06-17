import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { listings } from '../services/api';
import { useAuth } from '../hooks/useAuth';

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

export const HostListingForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    console.log('Current user:', user);
    console.log('User role:', user?.role);
    console.log('User ID:', user?._id);
  }, [user]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ListingFormData>({
    resolver: zodResolver(listingSchema),
    defaultValues: {
      title: '',
      description: '',
      location: {
        address: '',
        city: '',
        state: '',
        country: '',
        coordinates: { lat: 0, lng: 0 }
      },
      price: 0,
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

  // Convert file to base64 with compression
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // Calculate new dimensions (max 600px width/height for smaller size)
        const maxSize = 600;
        let { width, height } = img;
        
        if (width > height) {
          if (width > maxSize) {
            height = (height * maxSize) / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = (width * maxSize) / height;
            height = maxSize;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Draw and compress
        ctx?.drawImage(img, 0, 0, width, height);
        
        // Convert to base64 with lower quality 0.5 (50%) for smaller size
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.5);
        resolve(compressedDataUrl);
      };
      
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  };

  // Handle file upload
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    // Limit to maximum 5 images
    if (imageUrls.length + files.length > 5) {
      setError('Maximum 5 images allowed');
      return;
    }

    setUploading(true);
    try {
      const newImages: string[] = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Validate file type
        if (!file.type.startsWith('image/')) {
          throw new Error(`${file.name} is not an image file`);
        }
        
        // Validate file size (max 1MB before compression)
        if (file.size > 1 * 1024 * 1024) {
          throw new Error(`${file.name} is too large. Maximum size is 1MB`);
        }
        
        // Convert to base64 with compression
        const base64 = await fileToBase64(file);
        newImages.push(base64);
      }
      
      // Add new images to existing ones
      const updatedUrls = [...imageUrls, ...newImages];
      setImageUrls(updatedUrls);
      setValue('images', updatedUrls);
      
    } catch (err: any) {
      setError(err.message || 'Failed to upload images');
    } finally {
      setUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Handle drag and drop
  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (!files || files.length === 0) return;

    // Limit to maximum 5 images
    if (imageUrls.length + files.length > 5) {
      setError('Maximum 5 images allowed');
      return;
    }

    setUploading(true);
    try {
      const newImages: string[] = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        if (!file.type.startsWith('image/')) {
          throw new Error(`${file.name} is not an image file`);
        }
        
        if (file.size > 1 * 1024 * 1024) {
          throw new Error(`${file.name} is too large. Maximum size is 1MB`);
        }
        
        const base64 = await fileToBase64(file);
        newImages.push(base64);
      }
      
      const updatedUrls = [...imageUrls, ...newImages];
      setImageUrls(updatedUrls);
      setValue('images', updatedUrls);
      
    } catch (err: any) {
      setError(err.message || 'Failed to upload images');
    } finally {
      setUploading(false);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleRemoveImage = (index: number) => {
    const updatedUrls = imageUrls.filter((_, i) => i !== index);
    setImageUrls(updatedUrls);
    setValue('images', updatedUrls);
  };

  const onSubmit = async (data: any) => {
    console.log('Form submitted with data:', data);
    console.log('Form errors:', errors);
    
    try {
      setError(null);
      
      // Check if images are uploaded
      if (!data.images || data.images.length === 0) {
        setError('Please upload at least one image');
        return;
      }
      
      // Ensure coordinates are set
      const formData = {
        ...data,
        location: {
          ...data.location,
          coordinates: data.location.coordinates || { lat: 0, lng: 0 }
        }
      };
      
      console.log('Sending data to API:', formData);
      
      if (id) {
        const response = await listings.update(id, formData);
        console.log('Update response:', response);
        if (response.success) {
          navigate('/host/dashboard');
        }
      } else {
        const response = await listings.create(formData);
        console.log('Create response:', response);
        if (response.success) {
          navigate('/host/dashboard');
        }
      }
    } catch (err: any) {
      console.error('Error submitting form:', err);
      if (err.response?.status === 413) {
        setError('Images are too large. Please reduce image size or upload fewer images.');
      } else {
        setError(err.response?.data?.error || 'Failed to save listing');
      }
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
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              {...register('title')}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Description
            </label>
            <textarea
              id="description"
              rows={4}
              {...register('description')}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
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
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Address
              </label>
              <input
                type="text"
                id="address"
                {...register('location.address')}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
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
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                City
              </label>
              <input
                type="text"
                id="city"
                {...register('location.city')}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
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
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                State
              </label>
              <input
                type="text"
                id="state"
                {...register('location.state')}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
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
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Country
              </label>
              <input
                type="text"
                id="country"
                {...register('location.country')}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
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
                className="block text-sm font-medium text-gray-700 mb-2"
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
                  className="pl-7 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
              </div>
              {errors.price && (
                <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="maxGuests"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Maximum guests
              </label>
              <input
                type="number"
                id="maxGuests"
                {...register('maxGuests', { valueAsNumber: true })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
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
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Bedrooms
              </label>
              <input
                type="number"
                id="bedrooms"
                {...register('bedrooms', { valueAsNumber: true })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
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
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Bathrooms
              </label>
              <input
                type="number"
                id="bathrooms"
                {...register('bathrooms', { valueAsNumber: true })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
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
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                multiple
                accept="image/*"
                className="hidden"
              />
              
              {/* Drag and Drop Area */}
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:border-primary-400 transition-colors duration-200 cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="space-y-1 text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div className="flex text-sm text-gray-600">
                    <label className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500">
                      <span>Upload images</span>
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 1MB each (max 5 images, will be compressed)</p>
                </div>
              </div>
              
              {uploading && (
                <div className="mt-2 text-sm text-gray-600">
                  Uploading images...
                </div>
              )}
              
              {errors.images && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.images.message}
                </p>
              )}
            </div>
            
            {/* Image Preview Grid */}
            {imageUrls.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Uploaded Images ({imageUrls.length})</h4>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                  {imageUrls.map((url, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={url}
                        alt={`Listing ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
              type="button"
              onClick={() => {
                console.log('Test button clicked');
                console.log('Current form errors:', errors);
                console.log('Current form values:', watch());
                
                // Test API call with minimal data
                const testData = {
                  title: 'Test Listing',
                  description: 'Test Description',
                  location: {
                    address: '123 Test St',
                    city: 'Test City',
                    state: 'Test State',
                    country: 'Test Country',
                    coordinates: { lat: 0, lng: 0 }
                  },
                  price: 100,
                  images: ['data:image/jpeg;base64,test'],
                  amenities: ['WiFi'],
                  maxGuests: 2,
                  bedrooms: 1,
                  bathrooms: 1
                };
                
                console.log('Testing API call with:', testData);
                listings.create(testData)
                  .then(response => {
                    console.log('API call successful:', response);
                  })
                  .catch(error => {
                    console.error('API call failed:', error);
                  });
              }}
              className="px-4 py-2 border border-blue-300 rounded-md text-sm font-medium text-blue-700 hover:bg-blue-50"
            >
              Test API Call
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