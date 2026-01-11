import { useEffect, useState} from "react";
import { useQuery } from "@tanstack/react-query";

import { fetchWeather } from "@/entities/weather/api/fetchWeather";
import { useLocationStore } from "@/entities/location/model/location.store";

export function CurrentWeather() {
  const selectedLocation = useLocationStore(
    (state) => state.selectedLocation
  );

  // Browser geolocation fallback
  const [coords, setCoords] = useState<{
    lat: number;
    lon: number;
  } | null>(null);

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
    queryKey: ["weather", lat, lon],
    queryFn: () => fetchWeather(lat!, lon!),
    enabled: !!lat && !!lon,
  });

  if (isLoading) {
    return (
      <div className="p-4 bg-green-500 rounded text-white">
        Loading weather...
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-4 bg-green-500 rounded text-white">
        Failed to load weather
      </div>
    );
  }

  return (
    <div className="p-4 bg-green-500 rounded text-white space-y-2">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">
          {selectedLocation?.name ?? "Current Location"}
        </h2>
      </div>

      <p>Current: {data.main.temp}°C</p>
      <p>Low: {data.main.temp_min}°C</p>
      <p>High: {data.main.temp_max}°C</p>
    </div>
  );
}
