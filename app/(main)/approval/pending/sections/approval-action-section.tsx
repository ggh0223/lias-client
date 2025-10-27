/**
 * Approval Action Section - 결재 처리 섹션
 */

import ApprovalActionPanel from "../components/approval-action-panel";
import type { StepSnapshot } from "@/types/approval-process";

interface ApprovalActionSectionProps {
  selectedApproval: StepSnapshot | null;
  comment: string;
  onCommentChange: (value: string) => void;
  loading: boolean;
  error: string | null;
  getStepTypeLabel: (type: string) => string;
  getStepTypeColor: (type: string) => string;
  onApprove: () => void;
  onReject?: () => void;
}

export default function ApprovalActionSection({
  selectedApproval,
  comment,
  onCommentChange,
  loading,
  error,
  getStepTypeLabel,
  getStepTypeColor,
  onApprove,
  onReject,
}: ApprovalActionSectionProps) {
  return (
    <div className="lg:col-span-1">
      <div className="bg-white shadow rounded-lg p-6 sticky top-6">
        <ApprovalActionPanel
          selectedApproval={selectedApproval}
          comment={comment}
          onCommentChange={onCommentChange}
          loading={loading}
          error={error}
          getStepTypeLabel={getStepTypeLabel}
          getStepTypeColor={getStepTypeColor}
          onApprove={onApprove}
          onReject={onReject}
        />
      </div>
    </div>
  );
}
