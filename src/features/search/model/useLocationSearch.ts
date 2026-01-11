import { useMemo, useState } from "react";
import { koreaLocations } from "@/shared/lib/koreaDistricts";
import type { KoreaLocation } from "@/shared/lib/parseKoreaDistrict";

export function useLocationSearch() {
  const [query, setQuery] = useState("");

  const results: KoreaLocation[] = useMemo(() => {
    if (!query.trim()) return [];

    return koreaLocations
      .filter((location) =>
        location.fullName.includes(query)
      )
      .slice(0, 10);
  }, [query]);

  return {
    query,
    setQuery,
    results,
  };
}
