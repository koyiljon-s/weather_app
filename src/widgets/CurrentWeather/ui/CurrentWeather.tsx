import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { fetchWeather } from "@/entities/weather/api/fetchWeather";
import { useLocationStore } from "@/entities/location/model/location.store";

export function CurrentWeather() {
  const selectedLocation = useLocationStore((state) => state.selectedLocation);

  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);

  useEffect(() => {
    if (selectedLocation) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      () => console.error("Failed to get current location")
    );
  }, [selectedLocation]);

  const lat = selectedLocation?.lat ?? coords?.lat;
  const lon = selectedLocation?.lon ?? coords?.lon;

  const { data, isLoading, error } = useQuery({
    queryKey: ["weather", lat, lon],
    queryFn: () => fetchWeather(lat!, lon!),
    enabled: !!lat && !!lon,
  });

  if (isLoading) {
    return (
      <div className="bg-gray-100 rounded-xl p-6 text-center">
        <p className="text-gray-600">Loading current weather...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-gray-100 rounded-xl p-6 text-center">
        <p className="text-gray-600">Failed to load weather</p>
      </div>
    );
  }

  const cityName = selectedLocation?.name ?? data.name ?? "Current Location";
  const currentTemp = Math.round(data.main.temp);
  const minTemp = Math.round(data.main.temp_min);
  const maxTemp = Math.round(data.main.temp_max);
  const feelsLike = Math.round(data.main.feels_like);
  const description = data.weather[0]?.description || "—";

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-400 p-6">
  
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-800">{cityName}</h2>
        <p className="text-gray-600 capitalize">{description}</p>
      </div>

      <div className="flex items-center justify-between gap-6">
      
        <div className="flex items-center gap-4">
          <img
            src={`https://openweathermap.org/img/wn/${data.weather[0]?.icon}@2x.png`}
            alt={description}
            className="w-16 h-16"
          />
          <div>
            <div className="text-5xl font-bold text-gray-900">
              {currentTemp}°
            </div>
            <div className="text-sm text-gray-600 mt-1">
              Feels like {feelsLike}°
            </div>
          </div>
        </div>

        
        <div className="text-right">
          <div className="mb-3">
            <span className="text-xs text-gray-500 ml-2">Today's Highest Temp.</span>
            <span className="text-red-600 font-medium">↑</span>
            <span className="text-gray-800 font-medium ml-1">{maxTemp}°</span>
          </div>
          <div>
            <span className="text-xs text-gray-500 ml-2">Today's Lowest Temp.</span>
            <span className="text-blue-600 font-medium">↓</span>
            <span className="text-gray-800 font-medium ml-1">{minTemp}°</span>
          </div>
        </div>
      </div>
    </div>
  );
}