import { useQuery } from "@tanstack/react-query";
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Chip
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useFavoritesStore } from "@/entities/location/model/favorites.store";
import { fetchWeather } from "@/entities/weather/api/fetchWeather";
import { useLocationStore } from "@/entities/location/model/location.store";

export function FavoritesTable() {
  const favorites = useFavoritesStore((state) => state.favorites);
  const removeFavorite = useFavoritesStore((state) => state.removeFavorite);
  const setSelectedLocation = useLocationStore((state) => state.setSelectedLocation);

  if (favorites.length === 0) {
    return (
      <Card elevation={2}>
        <CardContent sx={{ textAlign: 'center', py: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, justifyContent: 'center' }}>
            <FavoriteIcon color="primary" />
            <Typography variant="h6" fontWeight={600}>
              Favorite Locations
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            No favorite locations added yet.<br />
            Search and add your preferred places!
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card elevation={2}>
      <CardContent sx={{ p: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 2, pb: 1 }}>
          <FavoriteIcon color="primary" />
          <Typography variant="h6" fontWeight={600}>
            Favorite Locations
          </Typography>
          <Chip label={`${favorites.length}/6`} size="small" color="primary" variant="outlined" sx={{ ml: 'auto' }} />
        </Box>

        <Box sx={{ display: { xs: 'block', lg: 'none' } }}>
          <List disablePadding>
            {favorites.map((favorite) => (
              <MobileFavoriteItem
                key={favorite.id}
                favorite={favorite}
                onRemove={() => removeFavorite(favorite.id)}
                onSelect={() => setSelectedLocation(favorite)}
              />
            ))}
          </List>
        </Box>

        <Box sx={{ display: { xs: 'none', lg: 'block' } }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: 'primary.light' }}>
                  <TableCell sx={{ fontWeight: 600 }}>Location</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600 }}>Current Temp</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600 }}>Weather</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {favorites.map((favorite) => (
                  <DesktopFavoriteRow
                    key={favorite.id}
                    favorite={favorite}
                    onRemove={() => removeFavorite(favorite.id)}
                    onSelect={() => setSelectedLocation(favorite)}
                  />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </CardContent>
    </Card>
  );
}

interface FavoriteRowProps {
  favorite: { id: string; name: string; lat: number; lon: number };
  onRemove: () => void;
  onSelect: () => void;
}

function DesktopFavoriteRow({ favorite, onRemove, onSelect }: FavoriteRowProps) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["weather", favorite.lat, favorite.lon],
    queryFn: () => fetchWeather(favorite.lat, favorite.lon),
    refetchInterval: 5 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <TableRow hover sx={{ cursor: 'pointer' }} onClick={onSelect}>
        <TableCell>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LocationOnIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
            <Typography fontWeight={500}>{favorite.name}</Typography>
          </Box>
        </TableCell>
        <TableCell colSpan={3} align="center">
          <Typography color="text.secondary">Loading...</Typography>
        </TableCell>
      </TableRow>
    );
  }

  if (error || !data) {
    return (
      <TableRow hover sx={{ cursor: 'pointer' }} onClick={onSelect}>
        <TableCell>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LocationOnIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
            <Typography fontWeight={500}>{favorite.name}</Typography>
          </Box>
        </TableCell>
        <TableCell colSpan={3} align="center">
          <Typography color="error">Failed to load</Typography>
        </TableCell>
      </TableRow>
    );
  }

  const temp = Math.round(data.main.temp);
  const description = data.weather[0]?.description || "—";
  const icon = data.weather[0]?.icon;

  return (
    <TableRow hover sx={{ cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }} onClick={onSelect}>
      <TableCell>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <LocationOnIcon sx={{ fontSize: 18, color: 'primary.main' }} />
          <Typography fontWeight={500}>{favorite.name}</Typography>
        </Box>
      </TableCell>
      <TableCell align="center">
        <Typography variant="h6" fontWeight={700}>{temp}°</Typography>
      </TableCell>
      <TableCell align="center">
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
          {icon && (
            <img
              src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
              alt={description}
              style={{ width: 40, height: 40 }}
            />
          )}
          <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>{description}</Typography>
        </Box>
      </TableCell>
      <TableCell align="right">
        <IconButton
          edge="end"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          size="small"
          color="error"
        >
          <DeleteIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  );
}

function MobileFavoriteItem({ favorite, onRemove, onSelect }: FavoriteRowProps) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["weather", favorite.lat, favorite.lon],
    queryFn: () => fetchWeather(favorite.lat, favorite.lon),
    refetchInterval: 5 * 60 * 1000,
  });

  return (
    <ListItem 
      divider 
      sx={{ px: 2, py: 1.5, '&:hover': { bgcolor: 'action.hover' } }}
      onClick={onSelect}
    >
      <ListItemText
        primary={favorite.name}
        secondary={
          isLoading ? 'Loading...' : 
          error || !data ? 'Failed to load' : 
          `${Math.round(data.main.temp)}° - ${data.weather[0]?.description}`
        }
        primaryTypographyProps={{ fontWeight: 500 }}
      />
      {data?.weather[0]?.icon && !isLoading && !error && (
        <Box sx={{ mr: 1 }}>
          <img
            src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`}
            alt=""
            style={{ width: 40, height: 40 }}
          />
        </Box>
      )}
      <ListItemSecondaryAction>
        <IconButton edge="end" onClick={(e) => { e.stopPropagation(); onRemove(); }} size="small" color="error">
          <DeleteIcon fontSize="small" />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
}
