// src/pages/home/ui/HomePage.tsx
import { LocationSearch } from "@/widgets/LocationSearch/ui/LocationSearch";
import { CurrentWeather } from "@/widgets/CurrentWeather/ui/CurrentWeather";

export function HomePage() {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-80 bg-blue-400 p-4">
        <LocationSearch />
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 bg-gray-100">
        <CurrentWeather />
      </main>
    </div>
  );
}
