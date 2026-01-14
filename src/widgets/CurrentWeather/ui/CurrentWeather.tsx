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
      <div className="bg-gray-100 rounded-xl p-4 sm:p-6 text-center">
        <p className="text-sm sm:text-base text-gray-600">Loading current weather...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-gray-100 rounded-xl p-4 sm:p-6 text-center">
        <p className="text-sm sm:text-base text-gray-600">Failed to load weather</p>
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
    <div className="bg-white rounded-xl shadow-sm border border-gray-400 p-4 sm:p-6">
      {/* City name and description */}
      <div className="mb-4">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
          {cityName}
        </h2>
        <p className="text-sm sm:text-base text-gray-600 capitalize">{description}</p>
      </div>

      {/* Main content - responsive layout */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6">
        {/* Left side - Weather icon and temperature */}
        <div className="flex items-center gap-3 sm:gap-4">
          <img
            src={`https://openweathermap.org/img/wn/${data.weather[0]?.icon}@2x.png`}
            alt={description}
            className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20"
          />
          <div>
            <div className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900">
              {currentTemp}°
            </div>
            <div className="text-xs sm:text-sm text-gray-600 mt-1">
              Feels like {feelsLike}°
            </div>
          </div>
        </div>

        {/* Right side - High/Low temperatures */}
        <div className="flex sm:flex-col gap-4 sm:gap-0 sm:text-right">
         
          <div className="flex-1 sm:mb-3">
            <div className="flex flex-col sm:flex-row sm:justify-end items-start sm:items-center gap-1">
              <span className="text-xs text-gray-500 sm:order-1">
                Today's Highest Temp.
              </span>
              <div className="sm:order-2">
                <span className="text-red-600 font-medium text-base sm:text-lg">↑</span>
                <span className="text-gray-800 font-medium ml-1 text-lg sm:text-xl">
                  {maxTemp}°
                </span>
              </div>
            </div>
          </div>

          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:justify-end items-start sm:items-center gap-1">
              <span className="text-xs text-gray-500 sm:order-1">
                Today's Lowest Temp.
              </span>
              <div className="sm:order-2">
                <span className="text-blue-600 font-medium text-base sm:text-lg">↓</span>
                <span className="text-gray-800 font-medium ml-1 text-lg sm:text-xl">
                  {minTemp}°
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}