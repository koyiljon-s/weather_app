import { useLocationSearch } from "@/features/search/model/useLocationSearch";
import { useLocationSelect } from "@/features/search/model/useLocationSelect";

export function LocationSearch() {
  const { query, setQuery, results } = useLocationSearch();
  const { selectLocation } = useLocationSelect();

  return (
    <div className="w-full max-w-md mx-auto">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="지역 검색 (예: 종로구, 청운동)"
        className="w-full p-2 border rounded"
      />

      {results.length > 0 && (
        <ul className="mt-2 border rounded bg-white max-h-64 overflow-auto">
          {results.map((location) => (
            <li
              key={location.key}
              onClick={() => selectLocation(location.fullName)}
              className="p-2 hover:bg-gray-100 cursor-pointer"
            >
              {location.fullName}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
