'use client'

import { useState, useEffect } from 'react'
import { MapPin, Loader2, AlertCircle } from 'lucide-react'

export default function LocationDetector({
  onLocationChange,
  location,
  locationLabel = "Washroom Location *",
  buttonText = "Get Current Location",
  detectingText = "Detecting...",
  lang,
  translations
}) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const getCurrentLocation = async () => {
    if (!navigator.geolocation) {
      setError(translations[lang].messages.locationNotSupported);
      return;
    }

    setIsLoading(true)
    setError(null)

    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000
        })
      })

      const { latitude, longitude } = position.coords

      let address = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`

      try {
        // Call your own API route instead of OpenCage directly
        const response = await fetch(
          `/api/geocode?lat=${latitude}&lng=${longitude}`
        )

        if (response.ok) {
          const data = await response.json()
          if (data.results && data.results.length > 0) {
            address = data.results[0].formatted
          }
        }
      } catch (geocodeError) {
        console.error('Reverse geocoding failed:', geocodeError)
      }

      const locationData = {
        latitude,
        longitude,
        address
      }

      onLocationChange(locationData)

    } catch (err) {
      switch (err.code) {
        case err.PERMISSION_DENIED:
          setError(translations[lang].messages.locationPermissionDenied);
          break;
        case err.POSITION_UNAVAILABLE:
          setError(translations[lang].messages.locationUnavailable);
          break;
        case err.TIMEOUT:
          setError(translations[lang].messages.locationTimeout);
          break;
        default:
          setError(translations[lang].messages.locationUnknownError);
          break;
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getCurrentLocation()
  }, [])

  return (
    <div className="space-y-3">
      <label className="flex items-center text-sm font-medium text-gray-700">
        <MapPin className="h-4 w-4 mr-1" />
        {locationLabel}
      </label>

      <div className="flex items-center space-x-3">
        <button
          type="button"
          onClick={getCurrentLocation}
          disabled={isLoading}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <MapPin className="h-4 w-4 mr-2" />
          )}
          {isLoading ? detectingText : buttonText}
        </button>
      </div>

      {location && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <MapPin className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-green-800">
                {translations[lang].fields.locationDetected}
              </p>
              <p className="text-green-700">{location.address}</p>
              <p className="text-green-600 text-xs mt-1">
                {translations[lang].fields.coordinates}: {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
              </p>
            </div>
          </div>
        </div>
      )}


      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-red-800">  {translations[lang].fields.locationError}</p>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
