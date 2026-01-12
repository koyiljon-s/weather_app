// src/widgets/LocationSearch/ui/LocationSearch.tsx
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useFavoritesStore } from '@/entities/location/model/favorites.store';
import { fetchWeather } from '@/entities/weather/api/fetchWeather';
import { useLocationSearch } from '@/features/search/model/useLocationSearch';
import { geocodeLocation } from '@/entities/location/api/geocode';
import type { KoreaLocation } from '@/shared/lib/parseKoreaDistrict';

export function LocationSearch() {
  const { query, setQuery, results } = useLocationSearch();
 

  const [selectedPreview, setSelectedPreview] = useState<{
    name: string;
    lat: number;
    lon: number;
  } | null>(null);

  const favorites = useFavoritesStore((s) => s.favorites);
  const addFavorite = useFavoritesStore((s) => s.addFavorite);

  const { data: previewData, isLoading: previewLoading } = useQuery({
    queryKey: ['weather-preview', selectedPreview?.lat, selectedPreview?.lon],
    queryFn: () => fetchWeather(selectedPreview!.lat, selectedPreview!.lon),
    enabled: !!selectedPreview?.lat && !!selectedPreview?.lon,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const handleSelect = async (item: KoreaLocation) => {
    let geo = await geocodeLocation(item.fullName);

    if (!geo && item.district) {
      geo = await geocodeLocation(`${item.district}, ${item.city}`);
    }

    if (!geo) {
      geo = await geocodeLocation(item.city);
    }

    if (!geo) {
      alert('Unable to find coordinates for the selected location.');
      return;
    }

    const location = {
      name: item.fullName,
      lat: geo.lat,
      lon: geo.lon,
    };

    setSelectedPreview(location);
  };

  const handleAdd = () => {
    if (!selectedPreview) return;

    const success = addFavorite({
      name: selectedPreview.name,
      lat: selectedPreview.lat,
      lon: selectedPreview.lon,
    });

    if (success) {
      setSelectedPreview(null);
      // You can add toast here later (e.g. react-hot-toast)
    } else {
      alert('You can add up to 6 favorites.');
    }
  };

  return (
    <div className="w-full">
      <p className="text-sm font-bold text-gray-800 mb-1">Search Location</p>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="지역 검색 (예: 종로구, 청운동)"
        className="w-full p-3 border-2 border-blue-500 rounded-lg focus:border-blue-400 focus:outline-none bg-white text-black"
      />

      {results.length > 0 && (
        <ul className="mt-2 border rounded-lg bg-blue-400 max-h-64 overflow-auto shadow-lg divide-y">
          {results.map((item) => (
            <li
              key={item.key}
              onClick={() => handleSelect(item)}
              className="p-3 hover:bg-blue-200 cursor-pointer"
            >
              {item.fullName || '이름 없음'}
            </li>
          ))}
        </ul>
      )}

      {/* Preview after selection */}
      {selectedPreview && (
        <div className="mt-5 p-4 bg-gray-700 rounded-lg border">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="w-full sm:w-auto">
              <h3 className="font-semibold text-lg">{selectedPreview.name}</h3>

              {previewLoading ? (
                <div className="mt-2 text-gray-500">Loading weather information...</div>
              ) : previewData ? (
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-3xl font-bold">
                    {Math.round(previewData.main.temp)}°
                  </span>
                  <span className="text-gray-300 capitalize">
                    {previewData.weather?.[0]?.description || '—'}
                  </span>
                </div>
              ) : (
                <div className="mt-2 text-red-600">Weather information cannot be retrieved</div>
              )}
            </div>

            <button
              onClick={handleAdd}
              disabled={favorites.length >= 6}
              className={`
                px-5 py-2.5 rounded-lg font-medium text-sm whitespace-nowrap
                ${
                  favorites.length >= 6
                    ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800'
                }
              `}
            >
              {favorites.length >= 6 ? 'Max 6' : 'Add to Favorites'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}