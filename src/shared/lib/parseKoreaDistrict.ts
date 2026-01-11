export interface KoreaLocation {
    city: string;
    district?: string;
    dong?: string;
    fullName: string;
    key: string;
  }
  
  export function parseKoreaDistrict(raw: string): KoreaLocation {
    const parts = raw.split("-");
  
    const city = parts[0];
    const district = parts[1];
    const dong = parts[2];
  
    const fullName = [city, district, dong].filter(Boolean).join(" ");
  
    return {
      city,
      district,
      dong,
      fullName,
      key: raw,
    };
  }