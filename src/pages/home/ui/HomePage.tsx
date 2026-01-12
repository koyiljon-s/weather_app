import { CurrentWeather } from "@/widgets/CurrentWeather/ui/CurrentWeather";
import { HourlyForecast } from "@/widgets/HourlyForecast/ui/HourlyForecast";
import { LocationSearch } from "@/widgets/LocationSearch/ui/LocationSearch";
import { FavoritesTable } from "@/widgets/FavoritesTable/ui/FavoritesTable";
import MapView from '@/widgets/MapView/ui/MapView';


export function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-4 max-w-7xl">
        <div className="space-y-6">
          <CurrentWeather />
          <HourlyForecast />
          <LocationSearch />
          <FavoritesTable />
          <MapView height="400px"  />
        </div>
      </div>
    </div>
  );
}