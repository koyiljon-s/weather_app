import { Grid, Typography, Box } from '@mui/material';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import { CurrentWeather } from "@/widgets/CurrentWeather/ui/CurrentWeather";
import { HourlyForecast } from "@/widgets/HourlyForecast/ui/HourlyForecast";
import { LocationSearch } from "@/widgets/LocationSearch/ui/LocationSearch";
import { FavoritesTable } from "@/widgets/FavoritesTable/ui/FavoritesTable";
import MapView from "@/widgets/MapView/ui/MapView";

export function HomePage() {
  return (
    <Box>
      <Typography variant="h3" component="h1" fontWeight={700} gutterBottom sx={{ color: 'text.primary' }}>
        Weather <Typography component="span" variant="h3" sx={{ color: 'primary.main' }}>
          <WbSunnyIcon sx={{ fontSize: 40, verticalAlign: 'middle', mr: 1 }} />
          App
        </Typography>
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, xl: 6 }}>
          <CurrentWeather />
        </Grid>

        <Grid size={{ xs: 12, xl: 6 }}>
          <HourlyForecast />
        </Grid>

        <Grid size={{ xs: 12, xl: 6 }}>
          <LocationSearch />
        </Grid>

        <Grid size={{ xs: 12, xl: 6 }}>
          <FavoritesTable />
        </Grid>

        <Grid size={12}>
          <MapView />
        </Grid>
      </Grid>
    </Box>
  );
}
