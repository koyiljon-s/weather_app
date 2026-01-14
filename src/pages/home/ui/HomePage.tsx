import { CurrentWeather } from "@/widgets/CurrentWeather/ui/CurrentWeather";
import { HourlyForecast } from "@/widgets/HourlyForecast/ui/HourlyForecast";
import { LocationSearch } from "@/widgets/LocationSearch/ui/LocationSearch";
import { FavoritesTable } from "@/widgets/FavoritesTable/ui/FavoritesTable";
import MapView from "@/widgets/MapView/ui/MapView";

export function HomePage() {
  return (
    <div className="w-full bg-gray-200 overflow-x-hidden">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 text-left mb-6 md:mb-8">
          Weather <span className="text-blue-600">App</span>
        </h1>

         <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">

           <div className="space-y-4 sm:space-y-6 lg:space-y-8">
             <CurrentWeather />
             <LocationSearch />
           </div>

           <div className="space-y-4 sm:space-y-6 lg:space-y-8">
             <HourlyForecast />
             <FavoritesTable />
           </div>
         </div>

        {/* Map - Full Width */}
        <div className="mt-4 sm:mt-6 lg:mt-8">
          <MapView />
        </div>
      </div>
    </div>
  );
}