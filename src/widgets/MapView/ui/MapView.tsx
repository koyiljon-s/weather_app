import { memo, useRef } from 'react';
import Map, {
  NavigationControl,
  Source,
  Layer,
  type MapRef,
} from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';

const MAP_STYLE = 'mapbox://styles/mapbox/outdoors-v12';

function MapViewComponent({ height = '500px' }: { height?: string }) {
  const mapRef = useRef<MapRef>(null);

  const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN;
  const weatherKey = import.meta.env.VITE_WEATHER_API_KEY;

  if (!mapboxToken || !weatherKey) {
    return (
      <div className="flex h-125 w-full items-center justify-center rounded-3xl bg-linear-to-br from-gray-200 to-sky-200 font-semibold text-gray-700">
        Missing API keys ☁️
      </div>
    );
  }

  return (
    <div
      className="relative w-full overflow-hidden rounded-3xl shadow-2xl"
      style={{ height }}
    >
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
        {/* ☁️ Cloud layer */}
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

      <div className="pointer-events-none absolute bottom-4 left-4 rounded-full bg-white/80 px-4 py-2 text-sm font-semibold shadow backdrop-blur">
        ☁️ Cloud Cover
      </div>
    </div>
  );
}

export default memo(MapViewComponent);
