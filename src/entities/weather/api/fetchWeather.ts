import { weatherApi } from "@/shared/api/weatherApi";

export async function fetchWeather(lat: number, lon: number) {
  const res = await weatherApi.get("/weather", {
    params: {
      lat,
      lon,
    },
  });

  return res.data;
}
