/**
 * Pending Approvals Panel - 결재 대기 목록 패널
 */

import Link from "next/link";
import type { StepSnapshot } from "@/types/approval-process";

interface PendingApprovalsPanelProps {
  pendingApprovals: StepSnapshot[];
}

export default function PendingApprovalsPanel({
  pendingApprovals,
}: PendingApprovalsPanelProps) {
  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; className: string }> = {
      PENDING: {
        label: "대기중",
        className: "bg-yellow-100 text-yellow-800",
      },
      APPROVED: { label: "승인", className: "bg-green-100 text-green-800" },
      REJECTED: { label: "반려", className: "bg-red-100 text-red-800" },
    };

    const badge = statusMap[status] || {
      label: status,
      className: "bg-gray-100 text-gray-800",
    };

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.className}`}
      >
        {badge.label}
      </span>
    );
  };

  const getStepTypeLabel = (stepType: string) => {
    const typeMap: Record<string, string> = {
      AGREEMENT: "협의",
      APPROVAL: "결재",
      IMPLEMENTATION: "시행",
      REFERENCE: "참조",
    };
    return typeMap[stepType] || stepType;
  };

  if (!pendingApprovals || pendingApprovals.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">결재 대기</h2>
          <Link
            href="/approval/pending"
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            전체보기
          </Link>
        </div>
        <div className="text-center py-8 text-gray-500">
          결재 대기 중인 문서가 없습니다.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">결재 대기</h2>
        <Link
          href="/approval/pending"
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          전체보기
        </Link>
      </div>

      <div className="space-y-3">
        {pendingApprovals.slice(0, 5).map((approval) => (
          <Link
            key={approval.id}
            href={`/documents/${approval.documentId}`}
            className="block p-4 border border-gray-200 rounded-lg hover:border-blue-400 hover:shadow-sm transition-all"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  {getStatusBadge(approval.status)}
                  <span className="text-xs text-gray-500">
                    {getStepTypeLabel(approval.stepType)}
                  </span>
                </div>
                <p className="text-sm font-medium text-gray-900">
                  {approval.documentTitle || "제목 없음"}
                </p>
                {approval.documentNumber && (
                  <p className="text-xs text-gray-500 mt-1">
                    문서번호: {approval.documentNumber}
                  </p>
                )}
              </div>
              <div className="ml-4 text-xs text-gray-500">
                {approval.approvedAt
                  ? new Date(approval.approvedAt).toLocaleDateString()
                  : "대기중"}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
