/**
 * Approval List Section - 결재 목록 섹션
 */

import ApprovalListPanel from "../components/approval-list-panel";
import type { StepSnapshot } from "@/types/approval-process";

interface ApprovalListSectionProps {
  approvals: StepSnapshot[];
  selectedApproval: StepSnapshot | null;
  onSelect: (approval: StepSnapshot) => void;
  getStepTypeLabel: (type: string) => string;
  getStepTypeColor: (type: string) => string;
  getStatusBadge: (status: string) => JSX.Element;
}

export default function ApprovalListSection({
  approvals,
  selectedApproval,
  onSelect,
  getStepTypeLabel,
  getStepTypeColor,
  getStatusBadge,
}: ApprovalListSectionProps) {
  return (
    <div className="lg:col-span-2">
      <ApprovalListPanel
        approvals={approvals}
        selectedApproval={selectedApproval}
        onSelect={onSelect}
        getStepTypeLabel={getStepTypeLabel}
        getStepTypeColor={getStepTypeColor}
        getStatusBadge={getStatusBadge}
      />
    </div>
  );
}
