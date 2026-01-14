import { useEffect, useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";

import { fetchForecast } from "@/entities/weather/api/fetchForecast";
import { useLocationStore } from "@/entities/location/model/location.store";

export function HourlyForecast() {
  const selectedLocation = useLocationStore((state) => state.selectedLocation);

  const [coords, setCoords] = useState<{
    lat: number;
    lon: number;
  } | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedLocation) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
        });
      },
      () => {
        console.error("Failed to get current location");
      }
    );
  }, [selectedLocation]);

  const lat = selectedLocation?.lat ?? coords?.lat;
  const lon = selectedLocation?.lon ?? coords?.lon;

  const { data, isLoading, error } = useQuery({
    queryKey: ["forecast", lat, lon],
    queryFn: () => fetchForecast(lat!, lon!),
    enabled: !!lat && !!lon,
  });

  if (isLoading) {
    return (
      <div className="p-4 bg-gray-100 rounded">
        <p className="text-gray-600">Loading forecast...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-4 bg-gray-100 rounded">
        <p className="text-gray-600">Failed to load forecast</p>
      </div>
    );
  }

  // Next ~24 hours (8 × 3-hour intervals)
  const forecastData = data.list.slice(0, 8);

  return (
    
    <div className="bg-gray-700 text-white p-5 rounded-xl shadow-md">
      <h2 className="text-base sm:text-lg font-semibold mb-4">
        Hourly Forecast
      </h2>
      <div
        ref={scrollRef}
        className="flex gap-5 overflow-x-auto pb-3 scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-800 snap-x snap-mandatory"
      >
        {forecastData.map((interval) => {
          const time = new Date(interval.dt * 1000);
          const hours = time.getHours();

          const timeLabel =
            hours === 0
              ? "12 AM"
              : hours === 12
              ? "12 PM"
              : hours < 12
              ? `${hours} AM`
              : `${hours - 12} PM`;

          return (
            <div
              key={interval.dt}
              className="flex flex-col items-center gap-1.5 min-w-18 snap-start"
            >
              <p className="text-xs font-medium opacity-90">{timeLabel}</p>

              <img
                src={`https://openweathermap.org/img/wn/${interval.weather[0].icon}@2x.png`}
                alt={interval.weather[0].description}
                className="w-11 h-11 -my-1"
              />

              <p className="text-lg font-bold tracking-tight">
                {Math.round(interval.main.temp)}°
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}