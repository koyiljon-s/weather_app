import { useQuery } from "@tanstack/react-query";
import { useFavoritesStore } from "@/entities/location/model/favorites.store";
import { fetchWeather } from "@/entities/weather/api/fetchWeather";
import { useLocationStore } from "@/entities/location/model/location.store";

export function FavoritesTable() {
  const favorites = useFavoritesStore((state) => state.favorites);
  const removeFavorite = useFavoritesStore((state) => state.removeFavorite);
  const setSelectedLocation = useLocationStore((state) => state.setSelectedLocation);

  if (favorites.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 text-center">
        <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-2 sm:mb-3">
          Favorite Locations
        </h2>
        <p className="text-sm sm:text-base text-gray-500">
          No favorite locations added yet.<br />
          Search and add your preferred places!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-400 overflow-hidden">
      {/* Header */}
      <div className="px-4 sm:px-5 py-3 sm:py-4 border-b bg-blue-200">
        <h2 className="text-base sm:text-lg font-semibold text-gray-800">
          Favorite Locations ({favorites.length}/6)
        </h2>
      </div>

      {/* Mobile: Card Layout */}
      <div className="block lg:hidden divide-y divide-gray-100">
        {favorites.map((favorite) => (
          <MobileFavoriteCard
            key={favorite.id}
            favorite={favorite}
            onRemove={() => removeFavorite(favorite.id)}
            onSelect={() => setSelectedLocation(favorite)}
          />
        ))}
      </div>

      {/* Desktop: Table Layout */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-green-200">
            <tr>
              <th className="text-left px-5 py-3 text-sm font-medium text-gray-600">
                Location
              </th>
              <th className="text-center px-4 py-3 text-sm font-medium text-gray-600">
                Current Temp
              </th>
              <th className="text-center px-4 py-3 text-sm font-medium text-gray-600">
                Weather
              </th>
              <th className="w-24"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {favorites.map((favorite) => (
              <FavoriteRow
                key={favorite.id}
                favorite={favorite}
                onRemove={() => removeFavorite(favorite.id)}
                onSelect={() => setSelectedLocation(favorite)}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

interface FavoriteRowProps {
  favorite: { id: string; name: string; lat: number; lon: number };
  onRemove: () => void;
  onSelect: () => void;
}

// Desktop Table Row
function FavoriteRow({ favorite, onRemove, onSelect }: FavoriteRowProps) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["weather", favorite.lat, favorite.lon],
    queryFn: () => fetchWeather(favorite.lat, favorite.lon),
    refetchInterval: 5 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <tr className="hover:bg-gray-50/50">
        <td className="px-5 py-4 font-medium text-gray-800">{favorite.name}</td>
        <td colSpan={3} className="px-4 py-4 text-center text-gray-500 text-sm">
          Loading...
        </td>
      </tr>
    );
  }

  if (error || !data) {
    return (
      <tr className="hover:bg-gray-50/50">
        <td className="px-5 py-4 font-medium text-gray-800">{favorite.name}</td>
        <td colSpan={3} className="px-4 py-4 text-center text-gray-500 text-sm">
          Failed to load weather
        </td>
      </tr>
    );
  }

  const temp = Math.round(data.main.temp);
  const description = data.weather[0]?.description || "—";
  const icon = data.weather[0]?.icon;

  return (
    <tr
      className="hover:bg-blue-50/40 cursor-pointer transition-colors"
      onClick={onSelect}
    >
      <td className="px-5 py-4 font-medium text-gray-900">{favorite.name}</td>

      <td className="px-4 py-4 text-center">
        <span className="text-xl font-bold text-gray-800">{temp}°</span>
      </td>

      <td className="px-4 py-4">
        <div className="flex items-center justify-center gap-2.5">
          {icon && (
            <img
              src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
              alt={description}
              className="w-9 h-9"
            />
          )}
          <span className="text-sm text-gray-600 capitalize">{description}</span>
        </div>
      </td>

      <td className="px-4 py-4 text-right">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="text-gray-200 hover:text-gray-300 text-sm font-medium px-2 py-1 rounded hover:bg-red-50 transition-colors"
        >
          Remove
        </button>
      </td>
    </tr>
  );
}

// Mobile Card Layout
function MobileFavoriteCard({ favorite, onRemove, onSelect }: FavoriteRowProps) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["weather", favorite.lat, favorite.lon],
    queryFn: () => fetchWeather(favorite.lat, favorite.lon),
    refetchInterval: 5 * 60 * 1000,
  });

  return (
    <div
      onClick={onSelect}
      className="p-4 hover:bg-blue-50/40 cursor-pointer transition-colors active:bg-blue-100/40"
    >
      {/* Header with location name and remove button */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="font-medium text-gray-900 text-sm flex-1 wrap-break-words">
          {favorite.name}
        </h3>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="text-gray-200 hover:text-gray-300 text-xs font-medium px-2 py-1 rounded hover:bg-red-50 transition-colors shrink-0"
        >
          Remove
        </button>
      </div>

      {/* Weather Info */}
      {isLoading ? (
        <p className="text-sm text-gray-500">Loading...</p>
      ) : error || !data ? (
        <p className="text-sm text-gray-500">Failed to load weather</p>
      ) : (
        <div className="flex items-center justify-between gap-3">
          {/* Left: Weather icon and description */}
          <div className="flex items-center gap-2">
            {data.weather[0]?.icon && (
              <img
                src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`}
                alt={data.weather[0]?.description}
                className="w-10 h-10"
              />
            )}
            <span className="text-xs text-gray-600 capitalize">
              {data.weather[0]?.description || "—"}
            </span>
          </div>

          {/* Right: Temperature */}
          <span className="text-2xl font-bold text-gray-800">
            {Math.round(data.main.temp)}°
          </span>
        </div>
      )}
    </div>
  );
}