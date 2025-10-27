"use client";

import type { ApprovalLineTemplate } from "@/types/approval-flow";

interface BasicInfoPanelProps {
  template: ApprovalLineTemplate;
}

export default function BasicInfoPanel({ template }: BasicInfoPanelProps) {
  const getTypeBadge = (type: string) => {
    const typeMap: Record<string, { label: string; className: string }> = {
      COMMON: { label: "공용", className: "bg-blue-100 text-blue-800" },
      DEDICATED: { label: "전용", className: "bg-purple-100 text-purple-800" },
    };

    const badge = typeMap[type] || {
      label: type,
      className: "bg-gray-100 text-gray-800",
    };

    return (
      <span
        className={`inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium ${badge.className}`}
      >
        {badge.label}
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; className: string }> = {
      ACTIVE: { label: "활성", className: "bg-green-100 text-green-800" },
      INACTIVE: {
        label: "비활성",
        className: "bg-gray-100 text-gray-800",
      },
    };

    const badge = statusMap[status] || {
      label: status,
      className: "bg-gray-100 text-gray-800",
    };

    return (
      <span
        className={`inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium ${badge.className}`}
      >
        {badge.label}
      </span>
    );
  };

  return (
    <div className="px-6 py-5 space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <div>
          <dt className="text-sm font-medium text-gray-500">템플릿 ID</dt>
          <dd className="mt-1 text-sm text-gray-900 font-mono text-xs">
            {template.id}
          </dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-gray-500">템플릿명</dt>
          <dd className="mt-1 text-sm text-gray-900">{template.name}</dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-gray-500">유형</dt>
          <dd className="mt-1">{getTypeBadge(template.type)}</dd>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <dt className="text-sm font-medium text-gray-500">조직 범위</dt>
          <dd className="mt-1 text-sm text-gray-900">{template.orgScope}</dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-gray-500">상태</dt>
          <dd className="mt-1">{getStatusBadge(template.status)}</dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-gray-500">생성일</dt>
          <dd className="mt-1 text-sm text-gray-900">
            {new Date(template.createdAt).toLocaleString()}
          </dd>
        </div>
      </div>
    </div>
  );
}
