"use client";

import type { Document } from "@/types/document";
import DocumentStatusPanel from "../components/document-status-panel";

interface DocumentInfoSectionProps {
  document: Document;
}

export default function DocumentInfoSection({
  document,
}: DocumentInfoSectionProps) {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">문서 정보</h2>
      <DocumentStatusPanel document={document} />
    </div>
  );
}
