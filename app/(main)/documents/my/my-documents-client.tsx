"use client";

import { useState } from "react";
import Link from "next/link";
import type { Document } from "@/types/api";

interface MyDocumentsClientProps {
  initialDocuments: Document[];
  token: string;
}

export default function MyDocumentsClient({
  initialDocuments,
}: MyDocumentsClientProps) {
  const [documents] = useState(initialDocuments);
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");

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

  const statuses = [
    { value: "ALL", label: "전체", count: documents.length },
    {
      value: "DRAFT",
      label: "임시저장",
      count: documents.filter((d) => d.status === "DRAFT").length,
    },
    {
      value: "PENDING",
      label: "결재대기",
      count: documents.filter((d) => d.status === "PENDING").length,
    },
    {
      value: "APPROVED",
      label: "승인완료",
      count: documents.filter((d) => d.status === "APPROVED").length,
    },
    {
      value: "REJECTED",
      label: "반려",
      count: documents.filter((d) => d.status === "REJECTED").length,
    },
  ];

  const filteredDocuments =
    selectedStatus === "ALL"
      ? documents
      : documents.filter((doc) => doc.status === selectedStatus);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">내 문서</h1>
          <p className="mt-1 text-sm text-gray-500">
            작성한 문서를 조회하고 관리하세요.
          </p>
        </div>
        <Link
          href="/documents/new"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          ✏️ 새 문서 작성
        </Link>
      </div>

      {/* Status Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
            {statuses.map((status) => (
              <button
                key={status.value}
                onClick={() => setSelectedStatus(status.value)}
                className={`
                                    whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                                    ${
                                      selectedStatus === status.value
                                        ? "border-blue-500 text-blue-600"
                                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                    }
                                `}
              >
                {status.label}
                <span
                  className={`
                                        ml-2 py-0.5 px-2.5 rounded-full text-xs font-medium
                                        ${
                                          selectedStatus === status.value
                                            ? "bg-blue-100 text-blue-600"
                                            : "bg-gray-100 text-gray-900"
                                        }
                                    `}
                >
                  {status.count}
                </span>
              </button>
            ))}
          </nav>
        </div>

        {/* Documents Table */}
        <div className="overflow-x-auto">
          {filteredDocuments.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    문서 제목
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    상태
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    문서번호
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    작성일
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    제출일
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDocuments.map((doc) => (
                  <tr key={doc.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {doc.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(doc.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {doc.documentNumber || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(doc.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {doc.submittedAt
                        ? new Date(doc.submittedAt).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        href={`/documents/${doc.id}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        보기 →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-12">
              <span className="text-5xl">📄</span>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                문서가 없습니다
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                새 문서를 작성해보세요.
              </p>
              <div className="mt-6">
                <Link
                  href="/documents/new"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  ✏️ 새 문서 작성
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
