/**
 * Approval List Panel - 결재 대기 목록 패널
 */

import Link from "next/link";
import type { StepSnapshot } from "@/types/approval-process";

interface ApprovalListPanelProps {
  approvals: StepSnapshot[];
  selectedApproval: StepSnapshot | null;
  onSelect: (approval: StepSnapshot) => void;
  getStepTypeLabel: (type: string) => string;
  getStepTypeColor: (type: string) => string;
  getStatusBadge: (status: string) => JSX.Element;
}

export default function ApprovalListPanel({
  approvals,
  selectedApproval,
  onSelect,
  getStepTypeLabel,
  getStepTypeColor,
  getStatusBadge,
}: ApprovalListPanelProps) {
  return (
    <div className="space-y-4">
      {approvals.map((approval) => (
        <div
          key={approval.id}
          className={`bg-white shadow rounded-lg p-6 cursor-pointer hover:shadow-lg transition-shadow ${
            selectedApproval?.id === approval.id ? "ring-2 ring-blue-500" : ""
          }`}
          onClick={() => onSelect(approval)}
        >
          {/* 문서 정보 */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  {approval.documentTitle || "제목 없음"}
                </h3>
                {approval.documentNumber && (
                  <span className="text-xs text-gray-500 font-mono">
                    #{approval.documentNumber}
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                {approval.drafterName && (
                  <div className="flex items-center space-x-1">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    <span>
                      {approval.drafterName}
                      {approval.drafterDepartmentName &&
                        ` (${approval.drafterDepartmentName})`}
                    </span>
                  </div>
                )}
                {approval.submittedAt && (
                  <div className="flex items-center space-x-1">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>
                      {new Date(approval.submittedAt).toLocaleString("ko-KR", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                )}
              </div>
            </div>
            {approval.documentId && (
              <Link
                href={`/documents/${approval.documentId}`}
                onClick={(e) => e.stopPropagation()}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                상세보기 →
              </Link>
            )}
          </div>

          {/* 결재 단계 정보 */}
          <div className="border-t border-gray-200 pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStepTypeColor(
                    approval.stepType
                  )}`}
                >
                  {getStepTypeLabel(approval.stepType)} - 단계{" "}
                  {approval.stepOrder}
                </span>
                {approval.isRequired && (
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-800">
                    필수
                  </span>
                )}
                {getStatusBadge(approval.status)}
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>
                  {approval.approverName}
                  {approval.approverPositionTitle &&
                    ` · ${approval.approverPositionTitle}`}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
