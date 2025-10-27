"use client";

import type { ApprovalLineTemplate } from "@/types/approval-flow";
import BasicInfoPanel from "../components/basic-info-panel";

interface TemplateInfoSectionProps {
  template: ApprovalLineTemplate;
}

export default function TemplateInfoSection({
  template,
}: TemplateInfoSectionProps) {
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
      <div className="px-6 py-5 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">기본 정보</h2>
      </div>
      <BasicInfoPanel template={template} />
    </div>
  );
}
