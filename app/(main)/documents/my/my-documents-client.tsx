"use client";

import { useState, useEffect } from "react";
import { clientAuth } from "@/lib/auth-client";
import { useDocument } from "@/contexts/document-context";
import type { Document } from "@/types/document";
import DocumentManagementSection from "./sections/document-management-section";
import CreateDocumentWidget from "./widgets/create-document-widget";

interface MyDocumentsClientProps {
  initialDocuments: Document[];
  token: string;
}

export default function MyDocumentsClient({}: MyDocumentsClientProps) {
  const { documents, fetchDocuments } = useDocument();
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");

  // 초기 데이터 로드
  useEffect(() => {
    const loadData = async () => {
      const currentToken = clientAuth.getToken();
      if (currentToken) {
        await fetchDocuments(currentToken);
      }
    };
    loadData();
  }, [fetchDocuments]);

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
        <CreateDocumentWidget />
      </div>

      <DocumentManagementSection
        documents={filteredDocuments}
        statuses={statuses}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        getStatusBadge={getStatusBadge}
      />
    </div>
  );
}
