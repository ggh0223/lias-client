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
                <dd className="space-y-4">
                  {/* 협의 영역 */}
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-2">
                      협의
                    </div>
                    <div className="flex space-x-2">
                      {Array.from({ length: 5 }, (_, index) => {
                        const step = currentVersion.steps?.filter(
                          (s) => s.stepType === "AGREEMENT"
                        )[index];

                        return (
                          <div
                            key={index}
                            className="flex flex-col items-center"
                          >
                            <div
                              className={`w-20 h-20 rounded-lg border-2 flex flex-col items-center justify-center text-xs font-medium ${
                                step
                                  ? "border-blue-500 bg-blue-50 text-blue-700"
                                  : "border-gray-200 bg-gray-50 text-gray-400"
                              }`}
                            >
                              <div className="text-xs truncate w-full text-center px-1">
                                {step
                                  ? step.assigneeRule === "DRAFTER"
                                    ? "기안자"
                                    : step.assigneeRule === "DEPARTMENT_HEAD"
                                    ? "부서장"
                                    : step.assigneeRule === "SUPERIOR"
                                    ? "상급자"
                                    : step.assigneeRule === "FIXED"
                                    ? "고정직원"
                                    : step.assigneeRule
                                  : ""}
                              </div>
                              {step && step.required && (
                                <div className="text-red-500 text-xs">*</div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* 결재 영역 */}
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-2">
                      결재
                    </div>
                    <div className="flex space-x-2">
                      {Array.from({ length: 5 }, (_, index) => {
                        const step = currentVersion.steps?.filter(
                          (s) => s.stepType === "APPROVAL"
                        )[index];

                        return (
                          <div
                            key={index}
                            className="flex flex-col items-center"
                          >
                            <div
                              className={`w-20 h-20 rounded-lg border-2 flex flex-col items-center justify-center text-xs font-medium ${
                                step
                                  ? "border-green-500 bg-green-50 text-green-700"
                                  : "border-gray-200 bg-gray-50 text-gray-400"
                              }`}
                            >
                              <div className="text-xs truncate w-full text-center px-1">
                                {step
                                  ? step.assigneeRule === "DRAFTER"
                                    ? "기안자"
                                    : step.assigneeRule === "DEPARTMENT_HEAD"
                                    ? "부서장"
                                    : step.assigneeRule === "SUPERIOR"
                                    ? "상급자"
                                    : step.assigneeRule === "FIXED"
                                    ? "고정직원"
                                    : step.assigneeRule
                                  : ""}
                              </div>
                              {step && step.required && (
                                <div className="text-red-500 text-xs">*</div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* 시행 영역 */}
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-2">
                      시행
                    </div>
                    <div className="space-y-2">
                      {(() => {
                        const implementationSteps =
                          currentVersion.steps?.filter(
                            (s) => s.stepType === "IMPLEMENTATION"
                          ) || [];

                        if (implementationSteps.length > 0) {
                          return (
                            <div className="space-y-1">
                              {implementationSteps.map((step, index) => (
                                <div
                                  key={`${step.id}-${index}`}
                                  className="flex items-center justify-between p-2 bg-gray-50 rounded border"
                                >
                                  <div className="flex-1">
                                    <div className="text-sm font-medium">
                                      {step.defaultApproverId || "미지정"}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      {step.assigneeRule}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          );
                        } else {
                          return (
                            <div className="text-sm text-gray-600 p-2 rounded border-2 border-transparent">
                              시행자 없음
                            </div>
                          );
                        }
                      })()}
                    </div>
                  </div>

                  {/* 참조 영역 */}
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-2">
                      참조
                    </div>
                    <div className="space-y-2">
                      {(() => {
                        const referenceSteps =
                          currentVersion.steps?.filter(
                            (s) => s.stepType === "REFERENCE"
                          ) || [];

                        if (referenceSteps.length > 0) {
                          return (
                            <div className="space-y-1">
                              {referenceSteps.map((step, index) => (
                                <div
                                  key={`${step.id}-${index}`}
                                  className="flex items-center justify-between p-2 bg-gray-50 rounded border"
                                >
                                  <div className="flex-1">
                                    <div className="text-sm font-medium">
                                      {step.defaultApproverId || "미지정"}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      {step.assigneeRule}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          );
                        } else {
                          return (
                            <div className="text-sm text-gray-600 p-2 rounded border-2 border-transparent">
                              참조자 없음
                            </div>
                          );
                        }
                      })()}
                    </div>
                  </div>
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
