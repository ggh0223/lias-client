"use client";

import { FormApprovalLine } from "../../../_lib/api/document-api";

interface ApprovalLineTableProps {
  approvalLines: FormApprovalLine[];
  onView: (approvalLine: FormApprovalLine) => void;
  onEdit: (approvalLine: FormApprovalLine) => void;
  onDelete: (id: string) => void;
  loading?: boolean;
}

export const ApprovalLineTable = ({
  approvalLines,
  onView,
  onEdit,
  onDelete,
  loading = false,
}: ApprovalLineTableProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case "COMMON":
        return "bg-primary/10 text-primary";
      case "CUSTOM":
        return "bg-secondary/10 text-secondary";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "COMMON":
        return "공통";
      case "CUSTOM":
        return "개인화";
      default:
        return type;
    }
  };

  if (loading) {
    return (
      <div className="bg-surface border border-border rounded-lg">
        <div className="p-6 border-b border-border">
          <h2 className="text-lg font-semibold text-primary">결재선 목록</h2>
        </div>
        <div className="p-6 text-center text-secondary">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          로딩 중...
        </div>
      </div>
    );
  }

  if (approvalLines.length === 0) {
    return (
      <div className="bg-surface border border-border rounded-lg">
        <div className="p-6 border-b border-border">
          <h2 className="text-lg font-semibold text-primary">결재선 목록</h2>
        </div>
        <div className="p-12 text-center text-secondary">
          <svg
            className="mx-auto h-12 w-12 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p className="text-lg font-medium mb-2">결재선이 없습니다</p>
          <p className="text-sm">새로운 결재선을 생성해보세요.</p>
        </div>
      </div>
    );
  }
  return (
    <div className="bg-surface border border-border rounded-lg">
      <div className="p-6 border-b border-border">
        <h2 className="text-lg font-semibold text-primary">결재선 목록</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-surface/50 border-b border-border">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">
                결재선명
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">
                설명
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">
                타입
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">
                단계
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">
                상태
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">
                생성일
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">
                액션
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {approvalLines.map((approvalLine) => (
              <tr
                key={approvalLine.formApprovalLineId}
                className="hover:bg-surface/50"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-primary">
                    {approvalLine.name}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-secondary max-w-xs truncate">
                    {approvalLine.description || "-"}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeBadgeColor(
                      approvalLine.type
                    )}`}
                  >
                    {getTypeLabel(approvalLine.type)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
                    {approvalLine.formApprovalSteps?.length}단계
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      approvalLine.isActive
                        ? "bg-success/10 text-success"
                        : "bg-danger/10 text-danger"
                    }`}
                  >
                    {approvalLine.isActive ? "활성" : "비활성"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary">
                  {formatDate(approvalLine.createdAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => onView(approvalLine)}
                    className="text-primary hover:text-primary/80 mr-3 transition-colors"
                  >
                    보기
                  </button>
                  <button
                    onClick={() => onEdit(approvalLine)}
                    className="text-secondary hover:text-primary mr-3 transition-colors"
                  >
                    수정
                  </button>
                  <button
                    onClick={() => onDelete(approvalLine.formApprovalLineId)}
                    className="text-danger hover:text-danger/80 transition-colors"
                  >
                    삭제
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
