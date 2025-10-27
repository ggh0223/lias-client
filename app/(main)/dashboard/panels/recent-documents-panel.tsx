/**
 * Recent Documents Panel - 최근 문서 패널
 */

import Link from "next/link";
import type { Document } from "@/types/document";

interface RecentDocumentsPanelProps {
  recentDocuments: Document[];
}

export default function RecentDocumentsPanel({
  recentDocuments,
}: RecentDocumentsPanelProps) {
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

  if (!recentDocuments || recentDocuments.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">최근 문서</h2>
          <Link
            href="/documents/my"
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            전체보기
          </Link>
        </div>
        <div className="text-center py-8 text-gray-500">
          작성한 문서가 없습니다.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">최근 문서</h2>
        <Link
          href="/documents/my"
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          전체보기
        </Link>
      </div>

      <div className="space-y-3">
        {recentDocuments.slice(0, 5).map((document) => (
          <Link
            key={document.id}
            href={`/documents/${document.id}`}
            className="block p-4 border border-gray-200 rounded-lg hover:border-blue-400 hover:shadow-sm transition-all"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                {getStatusBadge(document.status)}
                <p className="text-sm font-medium text-gray-900 mt-2">
                  {document.title}
                </p>
                {document.documentNumber && (
                  <p className="text-xs text-gray-500 mt-1">
                    문서번호: {document.documentNumber}
                  </p>
                )}
              </div>
              <div className="ml-4 text-xs text-gray-500">
                {new Date(document.createdAt).toLocaleDateString()}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
