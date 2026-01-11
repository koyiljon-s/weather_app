import { geocodeLocation } from "@/entities/location/api/geocode";
import { useLocationStore } from "@/entities/location/model/location.store";

export function useLocationSelect() {
  const setLocation = useLocationStore((s) => s.setLocation);

  async function selectLocation(fullName: string) {
    const geo = await geocodeLocation(fullName);
    if (!geo) return;

    setLocation({
      name: fullName,
      lat: geo.lat,
      lon: geo.lon,
    });
  }

  return { selectLocation };
}
