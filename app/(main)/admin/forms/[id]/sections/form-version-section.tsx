"use client";

import type { FormVersionDetail } from "@/types/approval-flow";
import FormVersionInfoPanel from "../components/form-version-info-panel";
import FormVersionTemplatePanel from "../components/form-version-template-panel";
import FormVersionApprovalLinePanel from "../components/form-version-approval-line-panel";

interface FormVersionSectionProps {
  currentVersion: FormVersionDetail;
}

export default function FormVersionSection({
  currentVersion,
}: FormVersionSectionProps) {
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">
          현재 버전 정보 (v{currentVersion.versionNo})
        </h2>
        {currentVersion.isActive ? (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            활성
          </span>
        ) : (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            비활성
          </span>
        )}
      </div>

      <div className="px-6 py-5 space-y-6">
        <FormVersionInfoPanel currentVersion={currentVersion} />
        <FormVersionTemplatePanel template={currentVersion.template || ""} />
        {currentVersion.approvalLineInfo && (
          <FormVersionApprovalLinePanel
            approvalLineInfo={currentVersion.approvalLineInfo}
          />
        )}
      </div>
    </div>
  );
}
