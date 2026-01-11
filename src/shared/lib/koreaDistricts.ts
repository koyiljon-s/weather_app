import rawData from "../data/korea_districts.json";
import { parseKoreaDistrict} from "./parseKoreaDistrict";
import type { KoreaLocation } from "./parseKoreaDistrict";

export const koreaLocations: KoreaLocation[] = rawData.map(
  (item: string) => parseKoreaDistrict(item)
);
