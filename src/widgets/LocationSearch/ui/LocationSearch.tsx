import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Autocomplete, 
  TextField, 
  Button, 
  CircularProgress,
  Paper,
  Snackbar,
  Alert
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useFavoritesStore } from '@/entities/location/model/favorites.store';
import { fetchWeather } from '@/entities/weather/api/fetchWeather';
import { useLocationSearch } from '@/features/search/model/useLocationSearch';
import { geocodeLocation } from '@/entities/location/api/geocode';
import type { KoreaLocation } from '@/shared/lib/parseKoreaDistrict';

export function LocationSearch() {
  const { query, setQuery, results } = useLocationSearch();

  const [selectedPreview, setSelectedPreview] = useState<{
    name: string;
    lat: number;
    lon: number;
  } | null>(null);

  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success'
  });

  const favorites = useFavoritesStore((s) => s.favorites);
  const addFavorite = useFavoritesStore((s) => s.addFavorite);

  const { data: previewData, isLoading: previewLoading } = useQuery({
    queryKey: ['weather-preview', selectedPreview?.lat, selectedPreview?.lon],
    queryFn: () => fetchWeather(selectedPreview!.lat, selectedPreview!.lon),
    enabled: !!selectedPreview?.lat && !!selectedPreview?.lon,
    staleTime: 5 * 60 * 1000,
  });

  const handleSelect = async (_: unknown, item: string | KoreaLocation | null) => {
    if (!item || typeof item === 'string') return;
    
    let geo = await geocodeLocation(item.fullName);

    if (!geo && item.district) {
      geo = await geocodeLocation(`${item.district}, ${item.city}`);
    }

    if (!geo) {
      geo = await geocodeLocation(item.city);
    }

    if (!geo) {
      setSnackbar({ open: true, message: 'Unable to find coordinates for the selected location.', severity: 'error' });
      return;
    }

    const location = {
      name: item.fullName,
      lat: geo.lat,
      lon: geo.lon,
    };

    setSelectedPreview(location);
  };

  const handleAdd = () => {
    if (!selectedPreview) return;
  
    const success = addFavorite({
      name: selectedPreview.name,
      lat: selectedPreview.lat,
      lon: selectedPreview.lon,
    });
  
    if (success) {
      setSelectedPreview(null);
      setSnackbar({ open: true, message: 'Location added to favorites!', severity: 'success' });
    } else {
      setSnackbar({ open: true, message: 'This location is already in favorites or max limit reached.', severity: 'error' });
    }
  };

  return (
    <Card elevation={2}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <SearchIcon color="primary" />
          <Typography variant="h6" fontWeight={600}>
            Search Location
          </Typography>
        </Box>

        <Autocomplete
          freeSolo
          options={results}
          getOptionLabel={(option) => typeof option === 'string' ? option : option.fullName || ''}
          onChange={handleSelect}
          onInputChange={(_, value) => setQuery(value)}
          inputValue={query}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="지역 검색 (예: 종로구, 청운동)"
              size="small"
              fullWidth
            />
          )}
          renderOption={(props, option) => (
            <li {...props}>
              <Typography variant="body2">{option.fullName}</Typography>
            </li>
          )}
          PaperComponent={({ children, ...props }) => (
            <Paper {...props} elevation={3}>{children}</Paper>
          )}
        />

        {selectedPreview && (
          <Paper 
            elevation={0} 
            sx={{ 
              mt: 2, 
              p: 2, 
              bgcolor: 'primary.main', 
              color: 'primary.contrastText',
              borderRadius: 2
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'stretch', sm: 'center'}, justifyContent: 'space-between', gap: 2 }}>
              <Box>
                <Typography variant="subtitle1" fontWeight={600}>
                  {selectedPreview.name}
                </Typography>

                {previewLoading ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                    <CircularProgress size={16} sx={{ color: 'inherit' }} />
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                      Loading weather...
                    </Typography>
                  </Box>
                ) : previewData ? (
                  <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mt: 0.5 }}>
                    <Typography variant="h4" fontWeight={700}>
                      {Math.round(previewData.main.temp)}°
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.8, textTransform: 'capitalize' }}>
                      {previewData.weather?.[0]?.description || ''}
                    </Typography>
                  </Box>
                ) : (
                  <Typography variant="body2" color="error.light" sx={{ mt: 0.5 }}>
                    Failed to load weather
                  </Typography>
                )}
              </Box>

              <Button
                onClick={handleAdd}
                disabled={favorites.length >= 6}
                variant="contained"
                color="secondary"
                startIcon={<FavoriteBorderIcon />}
                sx={{ whiteSpace: 'nowrap' }}
              >
                {favorites.length >= 6 ? 'Max 6 Favorites' : 'Add to Favorites'}
              </Button>
            </Box>
          </Paper>
        )}

        <Snackbar 
          open={snackbar.open} 
          autoHideDuration={3000} 
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert severity={snackbar.severity} variant="filled">
            {snackbar.message}
          </Alert>
        </Snackbar>
      </CardContent>
    </Card>
  );
}
