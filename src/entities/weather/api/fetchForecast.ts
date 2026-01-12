import { weatherApi } from "@/shared/api/weatherApi";

export interface HourlyForecast {
  dt: number;
  main: {
    temp: number;
    temp_min: number;
    temp_max: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
}

export interface ForecastResponse {
  list: HourlyForecast[];
}

export async function fetchForecast(
  lat: number,
  lon: number
): Promise<ForecastResponse> {
  const response = await weatherApi.get("/forecast", {
    params: {
      lat,
      lon,
      units: "metric",
    },
  });

  return response.data;
}