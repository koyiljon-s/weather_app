import { useQuery } from '@tanstack/react-query';
import {
  fetchCurrentWeather,
  fetchHourlyWeather,
} from '../api/weather.api';

export const useCurrentWeatherQuery = (
  lat?: number,
  lon?: number
) => {
  return useQuery({
    queryKey: ['currentWeather', lat, lon],
    queryFn: () => fetchCurrentWeather(lat!, lon!),
    enabled: !!lat && !!lon,
  });
};

export const useHourlyWeatherQuery = (
  lat?: number,
  lon?: number
) => {
  return useQuery({
    queryKey: ['hourlyWeather', lat, lon],
    queryFn: () => fetchHourlyWeather(lat!, lon!),
    enabled: !!lat && !!lon,
  });
};
