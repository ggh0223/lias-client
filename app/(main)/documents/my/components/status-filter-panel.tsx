/**
 * Status Filter Panel - 상태 필터 패널
 */

interface StatusItem {
  value: string;
  label: string;
  count: number;
}

interface StatusFilterPanelProps {
  statuses: StatusItem[];
  selectedStatus: string;
  onStatusChange: (value: string) => void;
}

export default function StatusFilterPanel({
  statuses,
  selectedStatus,
  onStatusChange,
}: StatusFilterPanelProps) {
  return (
    <div className="border-b border-gray-200">
      <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
        {statuses.map((status) => (
          <button
            key={status.value}
            onClick={() => onStatusChange(status.value)}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              selectedStatus === status.value
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            {status.label}
            <span
              className={`ml-2 py-0.5 px-2.5 rounded-full text-xs font-medium ${
                selectedStatus === status.value
                  ? "bg-blue-100 text-blue-600"
                  : "bg-gray-100 text-gray-900"
              }`}
            >
              {status.count}
            </span>
          </button>
        ))}
      </nav>
    </div>
  );
}
