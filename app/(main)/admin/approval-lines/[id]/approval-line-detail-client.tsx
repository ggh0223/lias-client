"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import type {
  ApprovalLineTemplate,
  ApprovalLineTemplateVersion,
} from "@/types/api";

interface ApprovalLineDetailClientProps {
  template: ApprovalLineTemplate;
  currentVersion: ApprovalLineTemplateVersion | null;
  token: string;
}

export default function ApprovalLineDetailClient({
  template,
  currentVersion,
}: ApprovalLineDetailClientProps) {
  const router = useRouter();

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

  const getStepTypeBadge = (type: string) => {
    const typeMap: Record<string, { label: string; className: string }> = {
      APPROVAL: { label: "결재", className: "bg-blue-100 text-blue-800" },
      AGREEMENT: {
        label: "협의",
        className: "bg-yellow-100 text-yellow-800",
      },
      IMPLEMENTATION: {
        label: "시행",
        className: "bg-purple-100 text-purple-800",
      },
      REFERENCE: { label: "참조", className: "bg-gray-100 text-gray-800" },
    };

    const badge = typeMap[type] || {
      label: type,
      className: "bg-gray-100 text-gray-800",
    };

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.className}`}
      >
        {badge.label}
      </span>
    );
  };

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

      {/* Template Information */}
      <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
        <div className="px-6 py-5 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">기본 정보</h2>
        </div>
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
              <dd className="mt-1 text-sm text-gray-900">
                {template.orgScope}
              </dd>
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
      </div>

      {/* Current Version & Steps */}
      {currentVersion && (
        <div className="bg-white shadow rounded-lg overflow-hidden">
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
          <div className="px-6 py-5 space-y-6">
            {currentVersion.changeReason && (
              <div>
                <dt className="text-sm font-medium text-gray-500">변경 사유</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {currentVersion.changeReason}
                </dd>
              </div>
            )}

            {/* Steps */}
            {currentVersion.steps && currentVersion.steps.length > 0 ? (
              <div>
                <dt className="text-sm font-medium text-gray-500 mb-3">
                  결재 단계
                </dt>
                <dd className="space-y-3">
                  {currentVersion.steps.map((step, index) => (
                    <div
                      key={step.id}
                      className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-sm font-semibold">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              {getStepTypeBadge(step.stepType)}
                              <span className="text-sm font-medium text-gray-900">
                                {step.assigneeRule}
                              </span>
                              {step.required && (
                                <span className="text-xs text-red-600">
                                  * 필수
                                </span>
                              )}
                            </div>
                            {step.defaultApproverId && (
                              <p className="text-sm text-gray-600">
                                기본 담당자 ID:{" "}
                                <span className="font-mono text-xs">
                                  {step.defaultApproverId}
                                </span>
                              </p>
                            )}
                            {step.targetDepartmentId && (
                              <p className="text-sm text-gray-600">
                                대상 부서 ID:{" "}
                                <span className="font-mono text-xs">
                                  {step.targetDepartmentId}
                                </span>
                              </p>
                            )}
                            {step.targetPositionId && (
                              <p className="text-sm text-gray-600">
                                대상 직책 ID:{" "}
                                <span className="font-mono text-xs">
                                  {step.targetPositionId}
                                </span>
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </dd>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">등록된 결재 단계가 없습니다.</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
              <div>
                <dt className="text-sm font-medium text-gray-500">생성일</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {new Date(currentVersion.createdAt).toLocaleString()}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">수정일</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {new Date(currentVersion.updatedAt).toLocaleString()}
                </dd>
              </div>
            </div>
          </div>
        </div>
      )}

      {!currentVersion && (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-12 text-center">
            <p className="text-gray-500">현재 활성화된 버전이 없습니다.</p>
          </div>
        </div>
      )}
    </div>
  );
}
