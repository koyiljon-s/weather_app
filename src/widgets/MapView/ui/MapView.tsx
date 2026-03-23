import { memo, useRef } from 'react';
import Map, {
  NavigationControl,
  Source,
  Layer,
  type MapRef,
} from 'react-map-gl/mapbox';
import { Paper, Typography, Box } from '@mui/material';
import CloudIcon from '@mui/icons-material/Cloud';
import 'mapbox-gl/dist/mapbox-gl.css';

const MAP_STYLE = 'mapbox://styles/mapbox/outdoors-v12';

function MapViewComponent({ height = '500px' }: { height?: string }) {
  const mapRef = useRef<MapRef>(null);

  const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN;
  const weatherKey = import.meta.env.VITE_WEATHER_API_KEY;

  if (!mapboxToken || !weatherKey) {
    return (
      <Paper elevation={3} sx={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 3 }}>
        <Typography variant="h6" color="text.secondary">
          Missing API keys
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper elevation={3} sx={{ borderRadius: 3, overflow: 'hidden' }}>
      <Box sx={{ position: 'relative', height }}>
        <Map
          ref={mapRef}
          mapboxAccessToken={mapboxToken}
          mapStyle={MAP_STYLE}
          initialViewState={{
            longitude: 127.5,
            latitude: 36,
            zoom: 5.5,
          }}
          style={{
            position: 'absolute',
            inset: 0,
          }}
        >
          <Source
            id="clouds"
            type="raster"
            tiles={[
              `https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${weatherKey}`,
            ]}
            tileSize={256}
          />
          <Layer
            id="clouds-layer"
            type="raster"
            source="clouds"
            paint={{ 'raster-opacity': 0.65 }}
          />

          <NavigationControl position="top-right" />
        </Map>

        <Paper
          elevation={4}
          sx={{
            position: 'absolute',
            bottom: 16,
            left: 16,
            px: 2,
            py: 1,
            borderRadius: 5,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            bgcolor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(4px)',
          }}
        >
          <CloudIcon color="primary" fontSize="small" />
          <Typography variant="body2" fontWeight={600}>
            Cloud Cover
          </Typography>
        </Paper>
      </Box>
    </Paper>
  );
}

export default memo(MapViewComponent);
