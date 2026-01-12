import { create } from "zustand";

interface Location {
  name: string;
  lat: number;
  lon: number;
}

interface LocationState {
  selectedLocation: Location | null;
  setSelectedLocation: (location: Location | null) => void;
}

export const useLocationStore = create<LocationState>((set) => ({
  selectedLocation: null,
  setSelectedLocation: (location) => set({ selectedLocation: location }),
}));