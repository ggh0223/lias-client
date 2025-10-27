"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import type {
  ApprovalLineTemplate,
  TemplateVersionDetail,
} from "@/types/approval-flow";
import TemplateInfoSection from "./sections/template-info-section";
import VersionInfoSection from "./sections/version-info-section";

interface ApprovalLineDetailClientProps {
  template: ApprovalLineTemplate;
  currentVersion: TemplateVersionDetail | null;
}

export default function ApprovalLineDetailClient({
  template,
  currentVersion,
}: ApprovalLineDetailClientProps) {
  const router = useRouter();

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{template.name}</h1>
          <p className="mt-1 text-sm text-gray-500">결재선 템플릿 상세 정보</p>
        </div>
        <div className="flex space-x-3">
          <Link
            href={`/admin/approval-lines/${template.id}/clone`}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            복제
          </Link>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            목록으로
          </button>
        </div>
      </div>

      {/* Template Information Section */}
      <TemplateInfoSection template={template} />

      {/* Current Version & Steps Section */}
      {currentVersion ? (
        <VersionInfoSection currentVersion={currentVersion} />
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-12 text-center">
            <p className="text-gray-500">현재 활성화된 버전이 없습니다.</p>
          </div>
        </div>
      )}
    </div>
  );
}
