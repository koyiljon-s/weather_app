import { useEffect, useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, Typography, Box, Skeleton, Stack } from "@mui/material";
import AccessTimeIcon from '@mui/icons-material/AccessTime';

import { fetchForecast } from "@/entities/weather/api/fetchForecast";
import { useLocationStore } from "@/entities/location/model/location.store";

export function HourlyForecast() {
  const selectedLocation = useLocationStore((state) => state.selectedLocation);

  const [coords, setCoords] = useState<{
    lat: number;
    lon: number;
  } | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedLocation) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
        });
      },
      () => {
        console.error("Failed to get current location");
      }
    );
  }, [selectedLocation]);

  const lat = selectedLocation?.lat ?? coords?.lat;
  const lon = selectedLocation?.lon ?? coords?.lon;

  const { data, isLoading, error } = useQuery({
    queryKey: ["forecast", lat, lon],
    queryFn: () => fetchForecast(lat!, lon!),
    enabled: !!lat && !!lon,
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <AccessTimeIcon color="primary" />
            <Typography variant="h6" fontWeight={600}>
              Hourly Forecast
            </Typography>
          </Box>
          <Stack direction="row" spacing={2} overflow="hidden">
            {[...Array(5)].map((_, i) => (
              <Box key={i} sx={{ minWidth: 70, textAlign: 'center' }}>
                <Skeleton variant="text" width={40} />
                <Skeleton variant="rectangular" width={50} height={50} sx={{ borderRadius: 1, my: 1 }} />
                <Skeleton variant="text" width={30} />
              </Box>
            ))}
          </Stack>
        </CardContent>
      </Card>
    );
  }

  if (error || !data) {
    return (
      <Card>
        <CardContent sx={{ textAlign: 'center', py: 4 }}>
          <Typography color="error">Failed to load forecast</Typography>
        </CardContent>
      </Card>
    );
  }

  const forecastData = data.list.slice(0, 8);

  return (
    <Card elevation={2}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <AccessTimeIcon color="primary" />
          <Typography variant="h6" fontWeight={600}>
            Hourly Forecast
          </Typography>
        </Box>
        <Box
          ref={scrollRef}
          sx={{
            display: 'flex',
            gap: 2.5,
            overflowX: 'auto',
            pb: 1,
            '&::-webkit-scrollbar': {
              height: 6,
            },
            '&::-webkit-scrollbar-thumb': {
              bgcolor: 'grey.400',
              borderRadius: 3,
            },
          }}
        >
          {forecastData.map((interval) => {
            const time = new Date(interval.dt * 1000);
            const hours = time.getHours();

            const timeLabel =
              hours === 0
                ? "12 AM"
                : hours === 12
                ? "12 PM"
                : hours < 12
                ? `${hours} AM`
                : `${hours - 12} PM`;

            return (
              <Box
                key={interval.dt}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 0.5,
                  minWidth: 70,
                  p: 1,
                  borderRadius: 2,
                  '&:hover': {
                    bgcolor: 'action.hover',
                  },
                }}
              >
                <Typography variant="caption" fontWeight={500} color="text.secondary">
                  {timeLabel}
                </Typography>

                <img
                  src={`https://openweathermap.org/img/wn/${interval.weather[0].icon}@2x.png`}
                  alt={interval.weather[0].description}
                  style={{ width: 50, height: 50 }}
                />

                <Typography variant="body1" fontWeight={700}>
                  {Math.round(interval.main.temp)}°
                </Typography>
              </Box>
            );
          })}
        </Box>
      </CardContent>
    </Card>
  );
}
