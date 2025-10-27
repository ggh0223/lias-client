/**
 * Search Filter Panel - 검색 및 필터 패널
 */

interface SearchFilterPanelProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterType: string;
  onFilterChange: (value: string) => void;
}

export default function SearchFilterPanel({
  searchTerm,
  onSearchChange,
  filterType,
  onFilterChange,
}: SearchFilterPanelProps) {
  return (
    <div className="p-4 border-b border-gray-200 space-y-3">
      <input
        type="text"
        placeholder="템플릿명으로 검색..."
        className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      <div className="flex space-x-2">
        <button
          onClick={() => onFilterChange("ALL")}
          className={`px-3 py-1 rounded-md text-sm font-medium ${
            filterType === "ALL"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          전체
        </button>
        <button
          onClick={() => onFilterChange("COMMON")}
          className={`px-3 py-1 rounded-md text-sm font-medium ${
            filterType === "COMMON"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          공용
        </button>
        <button
          onClick={() => onFilterChange("CUSTOM")}
          className={`px-3 py-1 rounded-md text-sm font-medium ${
            filterType === "CUSTOM"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          커스텀
        </button>
      </div>
    </div>
  );
}
