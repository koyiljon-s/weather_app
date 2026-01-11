import axios from "axios";

const geoApi = axios.create({
  baseURL: "https://api.openweathermap.org/geo/1.0",
  params: {
    appid: import.meta.env.VITE_WEATHER_API_KEY,
    limit: 1,
  },
});

export async function geocodeLocation(query: string) {
  const res = await geoApi.get("/direct", {
    params: {
      q: `${query},KR`,
    },
  });

  return res.data[0] || null;
}
