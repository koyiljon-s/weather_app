import { create } from "zustand";
import { persist } from "zustand/middleware";

interface FavoriteLocation {
  id: string;
  name: string;
  lat: number;
  lon: number;
}

interface FavoritesState {
  favorites: FavoriteLocation[];
  addFavorite: (location: Omit<FavoriteLocation, 'id'>) => boolean;
  removeFavorite: (id: string) => void;
  isFavorite: (name: string) => boolean;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],
      
      addFavorite: (location) => {
        const { favorites } = get();
        
      
        if (favorites.length >= 6) {
          return false;
        }
        

        if (favorites.some((fav) => fav.name === location.name)) {
          alert("Location already in favorites");
          return false;
        }

        const id = `${location.name}-${Date.now()}`;

        set({ 
          favorites: [...favorites, { ...location, id }] 
        });
        
        return true;
      },
      
      removeFavorite: (id) => {
        set((state) => ({
          favorites: state.favorites.filter((fav) => fav.id !== id),
        }));
      },
      
      isFavorite: (name) => {
        return get().favorites.some((fav) => fav.name === name);
      },
    }),
    {
      name: "weather-favorites",
    }
  )
);