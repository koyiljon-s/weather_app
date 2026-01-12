import { useLocationStore } from "@/entities/location/model/location.store";
import { geocodeLocation } from "@/entities/location/api/geocode";

export function useLocationSelect() {
  const setSelectedLocation = useLocationStore(
    (state) => state.setSelectedLocation
  );

  const selectLocation = async (locationName: string) => {
    try {
      // Geocode the location first
      const coords = await geocodeLocation(locationName);
      
      // Then set it as selected location
      setSelectedLocation({
        name: locationName,
        lat: coords.lat,
        lon: coords.lon,
      });
    } catch (error) {
      console.error("Failed to geocode location:", error);
      
      // Try with simplified name
      try {
        const parts = locationName.split(' ');
        const simpleName = parts.length > 1 ? parts[1] : parts[0];
        const coords = await geocodeLocation(simpleName);
        
        setSelectedLocation({
          name: locationName,
          lat: coords.lat,
          lon: coords.lon,
        });
      } catch (retryError) {
        console.error("Retry failed:", retryError);
        alert("위치를 찾을 수 없습니다. 다른 위치를 검색해 주세요.");
      }
    }
  };

  return { selectLocation };
}