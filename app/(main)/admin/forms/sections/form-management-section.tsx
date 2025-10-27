/**
 * Form Management Section - 양식 관리 섹션
 */

import FormSearchPanel from "../components/form-search-panel";
import FormListPanel from "../components/form-list-panel";
import type { Form } from "@/types/approval-flow";

interface FormManagementSectionProps {
  forms: Form[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  getStatusBadge: (status: string) => JSX.Element;
}

export default function FormManagementSection({
  forms,
  searchTerm,
  onSearchChange,
  getStatusBadge,
}: FormManagementSectionProps) {
  return (
    <div className="bg-white shadow rounded-lg">
      <FormSearchPanel
        searchTerm={searchTerm}
        onSearchChange={onSearchChange}
      />

      <FormListPanel forms={forms} getStatusBadge={getStatusBadge} />
    </div>
  );
}
