import React, { useState, useEffect } from 'react';
import Map, { Marker, Popup, NavigationControl, GeolocateControl } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Listing } from '../types';

interface MapComponentProps {
  listings: Listing[];
  selectedListing?: Listing | null;
  onListingSelect?: (listing: Listing) => void;
  height?: string;
  showControls?: boolean;
}

export const MapComponent: React.FC<MapComponentProps> = ({
  listings,
  selectedListing,
  onListingSelect,
  height = '400px',
  showControls = true
}) => {
  const [popupInfo, setPopupInfo] = useState<Listing | null>(null);
  const [viewState, setViewState] = useState({
    longitude: -74.006,
    latitude: 40.7128,
    zoom: 10
  });

  useEffect(() => {
    if (listings.length > 0) {
      // Calculate center point from all listings
      const lats = listings.map(l => l.location.coordinates.lat);
      const lngs = listings.map(l => l.location.coordinates.lng);
      const centerLat = (Math.min(...lats) + Math.max(...lats)) / 2;
      const centerLng = (Math.min(...lngs) + Math.max(...lngs)) / 2;
      
      setViewState(prev => ({
        ...prev,
        latitude: centerLat,
        longitude: centerLng,
        zoom: 11
      }));
    }
  }, [listings]);

  const handleMarkerClick = (listing: Listing) => {
    setPopupInfo(listing);
    if (onListingSelect) {
      onListingSelect(listing);
    }
  };

  return (
    <div style={{ height, width: '100%' }} className="rounded-lg overflow-hidden">
      <Map
        {...viewState}
        onMove={(evt: any) => setViewState(evt.viewState)}
        mapStyle="https://demotiles.maplibre.org/style.json"
        style={{ width: '100%', height: '100%' }}
      >
        {showControls && (
          <>
            <NavigationControl position="top-right" />
            <GeolocateControl position="top-left" />
          </>
        )}

        {listings.map((listing) => (
          <Marker
            key={listing._id}
            longitude={listing.location.coordinates.lng}
            latitude={listing.location.coordinates.lat}
            anchor="bottom"
            onClick={(e: any) => {
              e.originalEvent.stopPropagation();
              handleMarkerClick(listing);
            }}
          >
            <div className="relative">
              <div className="w-8 h-8 bg-primary-600 rounded-full border-2 border-white shadow-lg flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
                <span className="text-white text-xs font-bold">₹{listing.price}</span>
              </div>
              {selectedListing?._id === listing._id && (
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-primary-600"></div>
              )}
            </div>
          </Marker>
        ))}

        {popupInfo && (
          <Popup
            anchor="bottom"
            longitude={popupInfo.location.coordinates.lng}
            latitude={popupInfo.location.coordinates.lat}
            onClose={() => setPopupInfo(null)}
            closeOnClick={false}
            className="mapbox-popup"
          >
            <div className="p-2 max-w-xs">
              <img
                src={popupInfo.images[0]}
                alt={popupInfo.title}
                className="w-full h-24 object-cover rounded mb-2"
              />
              <h3 className="font-semibold text-gray-900 text-sm mb-1">
                {popupInfo.title}
              </h3>
              <p className="text-gray-600 text-xs mb-2">
                {popupInfo.location.city}, {popupInfo.location.country}
              </p>
              <div className="flex items-center justify-between">
                <span className="font-bold text-primary-600">
                  ₹{popupInfo.price}
                  <span className="text-gray-500 text-xs">/night</span>
                </span>
                <div className="flex items-center text-xs text-gray-500">
                  <span>{popupInfo.bedrooms} bed</span>
                  <span className="mx-1">•</span>
                  <span>{popupInfo.bathrooms} bath</span>
                </div>
              </div>
            </div>
          </Popup>
        )}
      </Map>
    </div>
  );
}; 