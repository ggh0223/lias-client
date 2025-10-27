/**
 * Dashboard Content Section
 * 주요 콘텐츠를 표시하는 섹션
 */

import PendingApprovalsPanel from "../panels/pending-approvals-panel";
import RecentDocumentsPanel from "../panels/recent-documents-panel";
import type { StepSnapshot } from "@/types/approval-process";
import type { Document } from "@/types/document";

interface DashboardContentSectionProps {
  pendingApprovals: StepSnapshot[];
  recentDocuments: Document[];
}

export default function DashboardContentSection({
  pendingApprovals,
  recentDocuments,
}: DashboardContentSectionProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <PendingApprovalsPanel pendingApprovals={pendingApprovals} />
      <RecentDocumentsPanel recentDocuments={recentDocuments} />
    </div>
  );
}
