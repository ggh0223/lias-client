"use client";

import type { ApprovalLineTemplate } from "@/types/approval-flow";

interface FormApprovalLineSectionProps {
  selectedTemplate: string;
  onTemplateChange: (value: string) => void;
  templates: ApprovalLineTemplate[];
  loading: boolean;
}

export default function FormApprovalLineSection({
  selectedTemplate,
  onTemplateChange,
  templates,
  loading,
}: FormApprovalLineSectionProps) {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">
        결재선 템플릿 (선택사항)
      </h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          연결할 결재선 템플릿
        </label>
        <select
          className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          value={selectedTemplate}
          onChange={(e) => onTemplateChange(e.target.value)}
          disabled={loading}
        >
          <option value="">결재선 없음 (문서 제출 시 자동 생성)</option>
          {templates.map((template) => (
            <option key={template.id} value={template.id}>
              {template.name} ({template.type})
            </option>
          ))}
        </select>
        {selectedTemplate ? (
          <p className="mt-1 text-sm text-gray-500">
            선택한 결재선 템플릿이 문서템플릿에 연결됩니다.
          </p>
        ) : (
          <p className="mt-1 text-sm text-blue-600">
            💡 결재선을 선택하지 않으면 문서 제출 시 기안자의 부서 계층에 따라
            자동으로 결재선이 생성됩니다.
          </p>
        )}
      </div>
    </div>
  );
}
