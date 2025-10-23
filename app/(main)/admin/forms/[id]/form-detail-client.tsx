"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Form, FormVersion } from "@/types/api";

interface FormDetailClientProps {
  form: Form;
  currentVersion: FormVersion | null;
  token: string;
}

export default function FormDetailClient({
  form,
  currentVersion,
}: FormDetailClientProps) {
  const router = useRouter();

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; className: string }> = {
      ACTIVE: { label: "활성", className: "bg-green-100 text-green-800" },
      INACTIVE: {
        label: "비활성",
        className: "bg-gray-100 text-gray-800",
      },
      DRAFT: { label: "임시저장", className: "bg-yellow-100 text-yellow-800" },
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
          <h1 className="text-2xl font-bold text-gray-900">{form.name}</h1>
          <p className="mt-1 text-sm text-gray-500">문서양식 상세 정보</p>
        </div>
        <div className="flex space-x-3">
          <Link
            href={`/admin/forms/${form.id}/edit`}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            수정
          </Link>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            목록으로
          </button>
        </div>
      </div>

      {/* Form Information */}
      <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
        <div className="px-6 py-5 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">기본 정보</h2>
        </div>
        <div className="px-6 py-5 space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">양식 ID</dt>
              <dd className="mt-1 text-sm text-gray-900 font-mono text-xs">
                {form.id}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">양식명</dt>
              <dd className="mt-1 text-sm text-gray-900">{form.name}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">양식 코드</dt>
              <dd className="mt-1 text-sm text-gray-900 font-mono">
                {form.code}
              </dd>
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
      </div>

      {/* Current Version */}
      {currentVersion && (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              현재 버전 정보
            </h2>
          </div>
          <div className="px-6 py-5 space-y-4">
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
              <div>
                <dt className="text-sm font-medium text-gray-500">활성 상태</dt>
                <dd className="mt-1">
                  {currentVersion.isActive ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      활성
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      비활성
                    </span>
                  )}
                </dd>
              </div>
            </div>

            {currentVersion.changeReason && (
              <div>
                <dt className="text-sm font-medium text-gray-500">변경 사유</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {currentVersion.changeReason}
                </dd>
              </div>
            )}

            <div>
              <dt className="text-sm font-medium text-gray-500 mb-2">
                템플릿 내용
              </dt>
              <dd className="mt-1">
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div
                    className="prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: currentVersion.template,
                    }}
                  />
                </div>
              </dd>
            </div>

            {/* 연결된 결재선 정보 */}
            {currentVersion.approvalLineInfo && (
              <div>
                <dt className="text-sm font-medium text-gray-500 mb-3">
                  연결된 결재선
                </dt>
                <dd className="mt-1">
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <div className="mb-4">
                      <h3 className="text-sm font-semibold text-gray-900">
                        {currentVersion.approvalLineInfo?.template?.name}
                      </h3>
                      {currentVersion.approvalLineInfo?.template
                        ?.description && (
                        <p className="text-xs text-gray-600 mt-1">
                          {
                            currentVersion.approvalLineInfo?.template
                              ?.description
                          }
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs text-gray-500">
                          버전: v
                          {
                            currentVersion.approvalLineInfo?.templateVersion
                              ?.versionNo
                          }
                        </span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-500">
                          유형:{" "}
                          {currentVersion.approvalLineInfo?.template?.type}
                        </span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-500">
                          범위:{" "}
                          {currentVersion.approvalLineInfo?.template?.orgScope}
                        </span>
                      </div>
                    </div>

                    {/* 결재 단계 */}
                    {currentVersion.approvalLineInfo?.steps &&
                    currentVersion.approvalLineInfo?.steps?.length > 0 ? (
                      <div className="space-y-3">
                        <h4 className="text-xs font-medium text-gray-700 mb-2">
                          결재 단계
                        </h4>

                        {/* 협의 영역 */}
                        <div>
                          <div className="text-xs font-medium text-gray-600 mb-1">
                            협의
                          </div>
                          <div className="flex space-x-1">
                            {Array.from({ length: 5 }, (_, index) => {
                              const step =
                                currentVersion.approvalLineInfo?.steps?.filter(
                                  (s) => s.stepType === "AGREEMENT"
                                )[index];

                              return (
                                <div
                                  key={index}
                                  className="flex flex-col items-center"
                                >
                                  <div
                                    className={`w-12 h-12 rounded-lg border-2 flex flex-col items-center justify-center text-xs font-medium ${
                                      step
                                        ? "border-blue-500 bg-blue-50 text-blue-700"
                                        : "border-gray-200 bg-gray-50 text-gray-400"
                                    }`}
                                  >
                                    <div className="text-xs truncate w-full text-center px-1">
                                      {step
                                        ? step.assigneeRule === "DRAFTER"
                                          ? "기안자"
                                          : step.assigneeRule ===
                                            "DEPARTMENT_HEAD"
                                          ? "부서장"
                                          : step.assigneeRule === "SUPERIOR"
                                          ? "상급자"
                                          : step.assigneeRule === "FIXED"
                                          ? "고정직원"
                                          : step.assigneeRule
                                        : ""}
                                    </div>
                                    {step && step.required && (
                                      <div className="text-red-500 text-xs">
                                        *
                                      </div>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* 결재 영역 */}
                        <div>
                          <div className="text-xs font-medium text-gray-600 mb-1">
                            결재
                          </div>
                          <div className="flex space-x-1">
                            {Array.from({ length: 5 }, (_, index) => {
                              const step =
                                currentVersion.approvalLineInfo?.steps?.filter(
                                  (s) => s.stepType === "APPROVAL"
                                )[index];

                              return (
                                <div
                                  key={index}
                                  className="flex flex-col items-center"
                                >
                                  <div
                                    className={`w-12 h-12 rounded-lg border-2 flex flex-col items-center justify-center text-xs font-medium ${
                                      step
                                        ? "border-green-500 bg-green-50 text-green-700"
                                        : "border-gray-200 bg-gray-50 text-gray-400"
                                    }`}
                                  >
                                    <div className="text-xs truncate w-full text-center px-1">
                                      {step
                                        ? step.assigneeRule === "DRAFTER"
                                          ? "기안자"
                                          : step.assigneeRule ===
                                            "DEPARTMENT_HEAD"
                                          ? "부서장"
                                          : step.assigneeRule === "SUPERIOR"
                                          ? "상급자"
                                          : step.assigneeRule === "FIXED"
                                          ? "고정직원"
                                          : step.assigneeRule
                                        : ""}
                                    </div>
                                    {step && step.required && (
                                      <div className="text-red-500 text-xs">
                                        *
                                      </div>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* 시행 영역 */}
                        <div>
                          <div className="text-xs font-medium text-gray-600 mb-1">
                            시행
                          </div>
                          <div className="space-y-1">
                            {(() => {
                              const implementationSteps =
                                currentVersion.approvalLineInfo?.steps?.filter(
                                  (s) => s.stepType === "IMPLEMENTATION"
                                ) || [];

                              if (implementationSteps.length > 0) {
                                return (
                                  <div className="space-y-1">
                                    {implementationSteps.map((step, index) => (
                                      <div
                                        key={`${step.id}-${index}`}
                                        className="flex items-center justify-between p-2 bg-white rounded border border-gray-200"
                                      >
                                        <div className="flex-1">
                                          <div className="text-xs font-medium">
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
                                  <div className="text-xs text-gray-500 p-2 rounded border border-gray-200">
                                    시행자 없음
                                  </div>
                                );
                              }
                            })()}
                          </div>
                        </div>

                        {/* 참조 영역 */}
                        <div>
                          <div className="text-xs font-medium text-gray-600 mb-1">
                            참조
                          </div>
                          <div className="space-y-1">
                            {(() => {
                              const referenceSteps =
                                currentVersion.approvalLineInfo?.steps?.filter(
                                  (s) => s.stepType === "REFERENCE"
                                ) || [];

                              if (referenceSteps.length > 0) {
                                return (
                                  <div className="space-y-1">
                                    {referenceSteps.map((step, index) => (
                                      <div
                                        key={`${step.id}-${index}`}
                                        className="flex items-center justify-between p-2 bg-white rounded border border-gray-200"
                                      >
                                        <div className="flex-1">
                                          <div className="text-xs font-medium">
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
                                  <div className="text-xs text-gray-500 p-2 rounded border border-gray-200">
                                    참조자 없음
                                  </div>
                                );
                              }
                            })()}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-xs text-gray-500">
                          등록된 결재 단계가 없습니다.
                        </p>
                      </div>
                    )}
                  </div>
                </dd>
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
