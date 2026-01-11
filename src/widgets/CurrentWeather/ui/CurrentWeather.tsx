import { useCurrentWeatherQuery } from "@/entities/weather/model/useWeatherQuery";

export const CurrentWeather = () => {
    const lat = 37.5665;
    const lon = 126.9780;
  
    const { data, isLoading, error } =
      useCurrentWeatherQuery(lat, lon);
  
    if (isLoading) return <div>Loading...</div>;
    if (error || !data)
      return <div>Failed to load weather</div>;
  
    return (
      <div className="p-4 rounded-lg bg-green-500 text-white">
        <h2 className="text-xl font-bold">
          {data.name}
        </h2>
        <p>Current: {data.main.temp}°C</p>
        <p>Low: {data.main.temp_min}°C</p>
        <p>High: {data.main.temp_max}°C</p>
      </div>
    );
  };