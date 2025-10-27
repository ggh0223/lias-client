"use client";

import type {
  ApprovalLineTemplate,
  TemplateVersionDetail,
} from "@/types/approval-flow";

interface VersionInfoPanelProps {
  template: ApprovalLineTemplate;
  currentVersion: TemplateVersionDetail | null;
}

export default function VersionInfoPanel({
  template,
  currentVersion,
}: VersionInfoPanelProps) {
  return (
    <div className="bg-white shadow rounded-lg p-6 mb-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">템플릿 정보</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-gray-500">템플릿명:</span>
          <span className="ml-2 font-medium text-gray-900">
            {template.name}
          </span>
        </div>
        <div>
          <span className="text-gray-500">유형:</span>
          <span className="ml-2 font-medium text-gray-900">
            {template.type}
          </span>
        </div>
        <div>
          <span className="text-gray-500">조직 범위:</span>
          <span className="ml-2 font-medium text-gray-900">
            {template.orgScope}
          </span>
        </div>
        <div>
          <span className="text-gray-500">상태:</span>
          <span className="ml-2 font-medium text-gray-900">
            {template.status}
          </span>
        </div>
        {currentVersion && (
          <div>
            <span className="text-gray-500">현재 버전:</span>
            <span className="ml-2 font-medium text-gray-900">
              v{currentVersion.versionNo}
            </span>
          </div>
        )}
      </div>
      {currentVersion && currentVersion.steps && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            ℹ️ 아래 단계들은 현재 버전(v{currentVersion.versionNo})의 단계를
            기반으로 초기화되었습니다. 필요에 따라 수정하세요.
          </p>
        </div>
      )}
    </div>
  );
}
