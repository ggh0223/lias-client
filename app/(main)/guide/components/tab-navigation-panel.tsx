/**
 * Tab Navigation Panel - 탭 네비게이션 패널
 */

interface TabNavigationPanelProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function TabNavigationPanel({
  activeTab,
  onTabChange,
}: TabNavigationPanelProps) {
  const tabs = [
    { value: "overview", label: "시스템 개요" },
    { value: "glossary", label: "용어 정의" },
    { value: "flow", label: "결재 흐름" },
    { value: "entities", label: "데이터 구조" },
    { value: "roles", label: "결재라인 역할" },
    { value: "status", label: "문서 상태" },
  ];

  return (
    <div className="border-b border-gray-200 mb-6">
      <nav className="-mb-px flex space-x-8">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => onTabChange(tab.value)}
            className={`${
              activeTab === tab.value
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
}
