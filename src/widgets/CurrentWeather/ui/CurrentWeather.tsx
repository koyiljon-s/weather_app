import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, Typography, Box, Skeleton, Chip } from "@mui/material";
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import AirIcon from '@mui/icons-material/Air';
import LocationOnIcon from '@mui/icons-material/LocationOn';

import { fetchWeather } from "@/entities/weather/api/fetchWeather";
import { useLocationStore } from "@/entities/location/model/location.store";

export function CurrentWeather() {
  const selectedLocation = useLocationStore((state) => state.selectedLocation);

  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);

  useEffect(() => {
    if (selectedLocation) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      () => console.error("Failed to get current location")
    );
  }, [selectedLocation]);

  const lat = selectedLocation?.lat ?? coords?.lat;
  const lon = selectedLocation?.lon ?? coords?.lon;

  const { data, isLoading, error } = useQuery({
    queryKey: ["weather", lat, lon],
    queryFn: () => fetchWeather(lat!, lon!),
    enabled: !!lat && !!lon,
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent>
          <Skeleton variant="text" width={200} height={40} />
          <Skeleton variant="text" width={150} height={24} />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
            <Skeleton variant="rectangular" width={80} height={80} sx={{ borderRadius: 2 }} />
            <Skeleton variant="text" width={100} height={60} />
          </Box>
        </CardContent>
      </Card>
    );
  }

  if (error || !data) {
    return (
      <Card>
        <CardContent sx={{ textAlign: 'center', py: 4 }}>
          <Typography color="error">Failed to load weather</Typography>
        </CardContent>
      </Card>
    );
  }

  const cityName = selectedLocation?.name ?? data.name ?? "Current Location";
  const currentTemp = Math.round(data.main.temp);
  const minTemp = Math.round(data.main.temp_min);
  const maxTemp = Math.round(data.main.temp_max);
  const feelsLike = Math.round(data.main.feels_like);
  const description = data.weather[0]?.description || "—";

  return (
    <Card elevation={2}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
          <LocationOnIcon sx={{ color: 'primary.main', fontSize: 20 }} />
          <Typography variant="h5" fontWeight={600}>
            {cityName}
          </Typography>
        </Box>
        
        <Chip label={description} size="small" variant="outlined" sx={{ textTransform: 'capitalize', mb: 2 }} />

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <img
              src={`https://openweathermap.org/img/wn/${data.weather[0]?.icon}@2x.png`}
              alt={description}
              style={{ width: 80, height: 80 }}
            />
            <Box>
              <Typography variant="h2" fontWeight={700}>
                {currentTemp}°
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
                <AirIcon sx={{ fontSize: 16 }} />
                <Typography variant="body2">
                  Feels like {feelsLike}°
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <ArrowUpwardIcon sx={{ color: 'error.main', fontSize: 20 }} />
              <Box>
                <Typography variant="caption" color="text.secondary">High</Typography>
                <Typography variant="body1" fontWeight={600} color="error.main">
                  {maxTemp}°
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <ArrowDownwardIcon sx={{ color: 'info.main', fontSize: 20 }} />
              <Box>
                <Typography variant="caption" color="text.secondary">Low</Typography>
                <Typography variant="body1" fontWeight={600} color="info.main">
                  {minTemp}°
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
