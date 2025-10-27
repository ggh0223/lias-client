/**
 * Template Management Section - 템플릿 관리 섹션
 */

import SearchFilterPanel from "../components/search-filter-panel";
import TemplateListPanel from "../components/template-list-panel";
import type { ApprovalLineTemplate } from "@/types/approval-flow";

interface TemplateManagementSectionProps {
  templates: ApprovalLineTemplate[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterType: string;
  onFilterChange: (value: string) => void;
  getTypeBadge: (type: string) => JSX.Element;
  getStatusBadge: (status: string) => JSX.Element;
}

export default function TemplateManagementSection({
  templates,
  searchTerm,
  onSearchChange,
  filterType,
  onFilterChange,
  getTypeBadge,
  getStatusBadge,
}: TemplateManagementSectionProps) {
  return (
    <div className="bg-white shadow rounded-lg">
      <SearchFilterPanel
        searchTerm={searchTerm}
        onSearchChange={onSearchChange}
        filterType={filterType}
        onFilterChange={onFilterChange}
      />

      <TemplateListPanel
        templates={templates}
        getTypeBadge={getTypeBadge}
        getStatusBadge={getStatusBadge}
      />
    </div>
  );
}
