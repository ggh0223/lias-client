/**
 * Form Search Panel - 양식 검색 패널
 */

interface FormSearchPanelProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export default function FormSearchPanel({
  searchTerm,
  onSearchChange,
}: FormSearchPanelProps) {
  return (
    <div className="p-4 border-b border-gray-200">
      <input
        type="text"
        placeholder="양식명 또는 코드로 검색..."
        className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  );
}
