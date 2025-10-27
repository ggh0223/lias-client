"use client";

import type { TemplateVersionDetail } from "@/types/approval-flow";

interface VersionHeaderPanelProps {
  currentVersion: TemplateVersionDetail;
}

export default function VersionHeaderPanel({
  currentVersion,
}: VersionHeaderPanelProps) {
  return (
    <div className="px-6 py-5 border-b border-gray-200">
      <div className="flex justify-between items-center">
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
    </div>
  );
}
