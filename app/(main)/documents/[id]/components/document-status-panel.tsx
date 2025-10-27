"use client";

import type { Document } from "@/types/document";

interface DocumentStatusPanelProps {
  document: Document;
}

export default function DocumentStatusPanel({
  document,
}: DocumentStatusPanelProps) {
  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; className: string }> = {
      DRAFT: { label: "임시저장", className: "bg-gray-100 text-gray-800" },
      PENDING: {
        label: "결재대기",
        className: "bg-yellow-100 text-yellow-800",
      },
      APPROVED: { label: "승인완료", className: "bg-green-100 text-green-800" },
      REJECTED: { label: "반려", className: "bg-red-100 text-red-800" },
      CANCELLED: { label: "취소", className: "bg-gray-100 text-gray-800" },
      IMPLEMENTED: {
        label: "시행완료",
        className: "bg-blue-100 text-blue-800",
      },
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

  return (
    <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div>
        <dt className="text-sm font-medium text-gray-500">문서 ID</dt>
        <dd className="mt-1 text-sm text-gray-900 font-mono text-xs">
          {document.id}
        </dd>
      </div>
      <div>
        <dt className="text-sm font-medium text-gray-500">상태</dt>
        <dd className="mt-1">{getStatusBadge(document.status)}</dd>
      </div>
      <div>
        <dt className="text-sm font-medium text-gray-500">양식 버전 ID</dt>
        <dd className="mt-1 text-sm text-gray-900">{document.formVersionId}</dd>
      </div>
      {document.documentNumber && (
        <div>
          <dt className="text-sm font-medium text-gray-500">문서번호</dt>
          <dd className="mt-1 text-sm text-gray-900">
            {document.documentNumber}
          </dd>
        </div>
      )}
      {document.submittedAt && (
        <div>
          <dt className="text-sm font-medium text-gray-500">제출일</dt>
          <dd className="mt-1 text-sm text-gray-900">
            {new Date(document.submittedAt).toLocaleString()}
          </dd>
        </div>
      )}
      {document.cancelReason && (
        <div className="sm:col-span-2">
          <dt className="text-sm font-medium text-gray-500">취소 사유</dt>
          <dd className="mt-1 text-sm text-gray-900">
            {document.cancelReason}
          </dd>
        </div>
      )}
    </dl>
  );
}
