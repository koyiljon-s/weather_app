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
      // Don't pass id - it will be generated automatically
    });
  
    if (success) {
      setSelectedPreview(null);
      alert('Location added to favorites!'); // Optional success message
    } else {
      // This alert will only show if at max capacity, not for duplicates
      // (duplicates show their own alert in the store)
    }
  };

  return (
    <div className="w-full">
      {/* Search Label */}
      <p className="text-xs sm:text-sm font-bold text-gray-800 mb-1 sm:mb-2">
        Search Location
      </p>

      {/* Search Input */}
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="지역 검색 (예: 종로구, 청운동)"
        className="w-full p-2.5 sm:p-3 text-sm sm:text-base border-2 border-blue-500 rounded-lg focus:border-blue-400 focus:outline-none bg-white text-black"
      />

      {/* Search Results */}
      {results.length > 0 && (
        <ul className="mt-2 border rounded-lg bg-blue-400 max-h-48 sm:max-h-64 overflow-auto shadow-lg divide-y">
          {results.map((item) => (
            <li
              key={item.key}
              onClick={() => handleSelect(item)}
              className="p-2.5 sm:p-3 hover:bg-blue-200 cursor-pointer text-sm sm:text-base active:bg-blue-300 transition-colors"
            >
              {item.fullName || '이름 없음'}
            </li>
          ))}
        </ul>
      )}

      {/* Preview Card after selection */}
      {selectedPreview && (
        <div className="mt-4 sm:mt-5 p-3 sm:p-4 bg-gray-700 rounded-lg border shadow-md">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
            <div className="w-full sm:w-auto">
              <h3 className="font-semibold text-base sm:text-lg text-white wrap-break-words">
                {selectedPreview.name}
              </h3>

              {previewLoading ? (
                <div className="mt-2 text-xs sm:text-sm text-gray-400">
                  Loading weather information...
                </div>
              ) : previewData ? (
                <div className="mt-1 sm:mt-2 flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-bold text-white">
                    {Math.round(previewData.main.temp)}°
                  </span>
                  <span className="text-xs sm:text-sm text-gray-300 capitalize">
                    {previewData.weather?.[0]?.description || '—'}
                  </span>
                </div>
              ) : (
                <div className="mt-2 text-xs sm:text-sm text-red-400">
                  Weather information cannot be retrieved
                </div>
              )}
            </div>

            <button
              onClick={handleAdd}
              disabled={favorites.length >= 6}
              className={`
                w-full sm:w-auto px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg font-medium text-xs sm:text-sm whitespace-nowrap
                transition-colors duration-200
                ${
                  favorites.length >= 6
                    ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800'
                }
              `}
            >
              {favorites.length >= 6 ? 'Max 6 Favorites' : 'Add to Favorites'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}