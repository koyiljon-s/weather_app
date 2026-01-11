import { http } from '@/shared/api/http';

export const fetchCurrentWeather = async (
    lat: number,
    lon: number
) => {
    const { data } = await http.get('/weather', {
        params: { lat, lon },
      });
      return data;
};

export const fetchHourlyWeather = async (
    lat: number,
    lon: number
  ) => {
    const { data } = await http.get('/forecast', {
      params: { lat, lon },
    });
    return data;
  };
