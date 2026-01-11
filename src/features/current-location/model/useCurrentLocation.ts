import { useState } from 'react';
import type { Location } from '@/entities/location/model/types';

export const useCurrentLocation = () => {
  const [location, setLocation] = useState<Location | null>(null);
  const [error, setError] = useState<string | null>(null);

  const detectLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
          name: 'Current Location',
        });
      },
      () => {
        setError('Location permission denied');
      }
    );
  };

  return { location, detectLocation, error };
};
