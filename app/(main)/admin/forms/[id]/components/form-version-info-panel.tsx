"use client";

import type { FormVersionDetail } from "@/types/approval-flow";

interface FormVersionInfoPanelProps {
  currentVersion: FormVersionDetail;
}

export default function FormVersionInfoPanel({
  currentVersion,
}: FormVersionInfoPanelProps) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <div>
        <dt className="text-sm font-medium text-gray-500">버전 ID</dt>
        <dd className="mt-1 text-sm text-gray-900 font-mono text-xs">
          {currentVersion.id}
        </dd>
      </div>
      <div>
        <dt className="text-sm font-medium text-gray-500">버전 번호</dt>
        <dd className="mt-1 text-sm text-gray-900">
          v{currentVersion.versionNo}
        </dd>
      </div>
      {currentVersion.changeReason && (
        <div>
          <dt className="text-sm font-medium text-gray-500">변경 사유</dt>
          <dd className="mt-1 text-sm text-gray-900">
            {currentVersion.changeReason}
          </dd>
        </div>
      )}
    </div>
  );
}
