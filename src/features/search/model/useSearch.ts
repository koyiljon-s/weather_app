import districts from '@/shared/data/korea_districts.json';

export const useSearch = (keyword: string) => {
  if (!keyword) return [];

  return districts.filter((item: string) =>
    item.includes(keyword)
  );
};
