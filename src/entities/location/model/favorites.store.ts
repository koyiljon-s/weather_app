// src/entities/location/model/favorites.store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface FavoriteLocation {
  id: string;
  name: string;
  lat: number;
  lon: number;
}

interface FavoritesState {
  favorites: FavoriteLocation[];
  addFavorite: (location: Omit<FavoriteLocation, 'id'>) => boolean; // returns success
  removeFavorite: (id: string) => void;
  isFavorite: (lat: number, lon: number) => boolean;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],

      addFavorite: (location) => {
        const current = get().favorites;

        if (current.length >= 6) {
          return false; // cannot add more
        }

        // Simple unique id
        const id = `${location.name}-${Math.round(location.lat * 10000)}-${Math.round(location.lon * 10000)}`;

        // Already exists check
        if (current.some(f => f.id === id)) {
          return false;
        }

        set({
          favorites: [...current, { ...location, id }]
        });

        return true;
      },

      removeFavorite: (id) =>
        set((state) => ({
          favorites: state.favorites.filter((f) => f.id !== id)
        })),

      isFavorite: (lat, lon) =>
        get().favorites.some(
          (f) => Math.abs(f.lat - lat) < 0.0001 && Math.abs(f.lon - lon) < 0.0001
        )
    }),
    {
      name: 'weather-favorites-v1'
    }
  )
);