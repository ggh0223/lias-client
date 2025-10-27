/**
 * Document Management Section - 문서 관리 섹션
 */

import StatusFilterPanel from "../components/status-filter-panel";
import DocumentTablePanel from "../components/document-table-panel";
import type { Document } from "@/types/document";

interface StatusItem {
  value: string;
  label: string;
  count: number;
}

interface DocumentManagementSectionProps {
  documents: Document[];
  statuses: StatusItem[];
  selectedStatus: string;
  onStatusChange: (value: string) => void;
  getStatusBadge: (status: string) => JSX.Element;
}

export default function DocumentManagementSection({
  documents,
  statuses,
  selectedStatus,
  onStatusChange,
  getStatusBadge,
}: DocumentManagementSectionProps) {
  return (
    <div className="bg-white rounded-lg shadow">
      <StatusFilterPanel
        statuses={statuses}
        selectedStatus={selectedStatus}
        onStatusChange={onStatusChange}
      />

      <DocumentTablePanel
        documents={documents}
        getStatusBadge={getStatusBadge}
      />
    </div>
  );
}
