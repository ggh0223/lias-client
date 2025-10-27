"use client";

import type { Form } from "@/types/approval-flow";

interface FormBasicInfoPanelProps {
  form: Form;
}

export default function FormBasicInfoPanel({ form }: FormBasicInfoPanelProps) {
  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; className: string }> = {
      ACTIVE: { label: "활성", className: "bg-green-100 text-green-800" },
      INACTIVE: {
        label: "비활성",
        className: "bg-gray-100 text-gray-800",
      },
      DRAFT: {
        label: "임시저장",
        className: "bg-yellow-100 text-yellow-800",
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
            {form.id}
          </dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-gray-500">템플릿명</dt>
          <dd className="mt-1 text-sm text-gray-900">{form.name}</dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-gray-500">템플릿 코드</dt>
          <dd className="mt-1 text-sm text-gray-900 font-mono">{form.code}</dd>
        </div>
      </div>

      <div>
        <dt className="text-sm font-medium text-gray-500">설명</dt>
        <dd className="mt-1 text-sm text-gray-900">
          {form.description || "설명 없음"}
        </dd>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <dt className="text-sm font-medium text-gray-500">상태</dt>
          <dd className="mt-1">{getStatusBadge(form.status)}</dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-gray-500">생성일</dt>
          <dd className="mt-1 text-sm text-gray-900">
            {new Date(form.createdAt).toLocaleString()}
          </dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-gray-500">수정일</dt>
          <dd className="mt-1 text-sm text-gray-900">
            {new Date(form.updatedAt).toLocaleString()}
          </dd>
        </div>
      </div>
    </div>
  );
}
