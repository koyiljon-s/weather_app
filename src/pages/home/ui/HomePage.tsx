import { CurrentWeather } from "@/widgets/CurrentWeather/ui/CurrentWeather";
import { HourlyForecast } from "@/widgets/HourlyForecast/ui/HourlyForecast";
import { LocationSearch } from "@/widgets/LocationSearch/ui/LocationSearch";
import { FavoritesTable } from "@/widgets/FavoritesTable/ui/FavoritesTable";
import MapView from "@/widgets/MapView/ui/MapView";

export function HomePage() {
  return (
    <div className="min-h-screen bg-purple-50 flex justify-center">
      
      <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 text-center md:text-left mb-6 md:mb-8">
          Weather <span className="text-blue-600">App</span>
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          
          <div className="space-y-4 sm:space-y-6">
            <CurrentWeather />
            <LocationSearch />
          </div>

          <div className="space-y-4 sm:space-y-6">
            <HourlyForecast />
            <FavoritesTable />
          </div>
        </div>

        <div className="mt-4 sm:mt-6">
          <MapView />
        </div>
      </div>
    </div>
  );
}