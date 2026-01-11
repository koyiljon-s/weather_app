import { create } from "zustand";

export interface SelectedLocation {
  name: string;
  lat: number;
  lon: number;
}

interface LocationState {
  selectedLocation: SelectedLocation | null;
  setLocation: (location: SelectedLocation) => void;
  clearLocation: () => void;
}

export const useLocationStore = create<LocationState>((set) => ({
  selectedLocation: null,
  setLocation: (location) => set({ selectedLocation: location }),
  clearLocation: () => set({ selectedLocation: null }),
}));
