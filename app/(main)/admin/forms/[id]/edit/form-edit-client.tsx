"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type {
  Form,
  FormVersionDetail,
  ApprovalLineTemplate,
} from "@/types/approval-flow";
import { apiClient } from "@/lib/api-client";

interface FormEditClientProps {
  form: Form;
  currentVersion: FormVersionDetail | null;
  templates: ApprovalLineTemplate[];
  token: string;
}

export default function FormEditClient({
  form,
  currentVersion,
  templates,
  token,
}: FormEditClientProps) {
  const router = useRouter();
  const [versionNote, setVersionNote] = useState("");
  const [template, setTemplate] = useState(currentVersion?.template || "");
  const [changeApprovalLine, setChangeApprovalLine] = useState(false);
  const [selectedTemplateVersionId, setSelectedTemplateVersionId] =
    useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [isPreviewMode, setIsPreviewMode] = useState(true);

  // currentVersion이 로드되면 template 업데이트
  useEffect(() => {
    if (currentVersion?.template) {
      setTemplate(currentVersion.template);
      console.log(
        "✅ 템플릿 로드됨:",
        currentVersion.template.substring(0, 100)
      );
    }
  }, [currentVersion]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!versionNote) {
      setError("변경 사유는 필수입니다.");
      return;
    }

    if (changeApprovalLine && !selectedTemplateVersionId) {
      setError("결재선 템플릿을 선택해주세요.");
      return;
    }

    setSaving(true);
    try {
      await apiClient.updateFormVersion(token, form.id, {
        versionNote,
        template,
        baseLineTemplateVersionId: changeApprovalLine
          ? selectedTemplateVersionId
          : undefined,
      });

      alert("문서템플릿이 수정되었습니다.");
      router.push(`/admin/forms/${form.id}`);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "문서템플릿 수정에 실패했습니다."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          문서템플릿 수정 (새 버전 생성)
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          문서템플릿을 수정하면 새 버전이 생성됩니다. 결재선도 변경할 수
          있습니다.
        </p>
      </div>

      {/* 현재 양식 정보 표시 */}
      <div className="bg-gray-50 shadow rounded-lg p-6 mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          현재 양식 정보
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <dt className="text-sm font-medium text-gray-500">양식명</dt>
            <dd className="mt-1 text-sm text-gray-900">{form.name}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">양식 코드</dt>
            <dd className="mt-1 text-sm text-gray-900">{form.code}</dd>
          </div>
          {form.description && (
            <div className="col-span-2">
              <dt className="text-sm font-medium text-gray-500">설명</dt>
              <dd className="mt-1 text-sm text-gray-900">{form.description}</dd>
            </div>
          )}
          {currentVersion && (
            <div className="col-span-2">
              <dt className="text-sm font-medium text-gray-500">현재 버전</dt>
              <dd className="mt-1 text-sm text-gray-900">
                v{currentVersion.versionNo}
              </dd>
            </div>
          )}
        </div>
      </div>

      {/* 현재 결재선 정보 */}
      {currentVersion?.approvalLineInfo && (
        <div className="bg-blue-50 shadow rounded-lg p-6 mb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            현재 연결된 결재선
          </h2>
          <div className="bg-white rounded-lg p-4 border border-blue-200">
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-900">
                {currentVersion.approvalLineInfo?.template?.name}
              </h3>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs text-gray-500">
                  버전: v
                  {currentVersion.approvalLineInfo?.templateVersion?.versionNo}
                </span>
                <span className="text-xs text-gray-400">•</span>
                <span className="text-xs text-gray-500">
                  유형: {currentVersion.approvalLineInfo?.template?.type}
                </span>
                <span className="text-xs text-gray-400">•</span>
                <span className="text-xs text-gray-500">
                  범위: {currentVersion.approvalLineInfo?.template?.orgScope}
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
                        <div key={index} className="flex flex-col items-center">
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
                                  : step.assigneeRule === "DRAFTER_SUPERIOR"
                                  ? "상급자"
                                  : step.assigneeRule === "FIXED"
                                  ? "고정직원"
                                  : step.assigneeRule === "DEPARTMENT_REFERENCE"
                                  ? "부서"
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
                        <div key={index} className="flex flex-col items-center">
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
                                  : step.assigneeRule === "DRAFTER_SUPERIOR"
                                  ? "상급자"
                                  : step.assigneeRule === "FIXED"
                                  ? "고정직원"
                                  : step.assigneeRule === "DEPARTMENT_REFERENCE"
                                  ? "부서"
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
                                    {step.assigneeRule === "DRAFTER"
                                      ? "기안자"
                                      : step.assigneeRule === "DRAFTER_SUPERIOR"
                                      ? "상급자"
                                      : step.assigneeRule === "FIXED"
                                      ? "고정직원"
                                      : step.assigneeRule ===
                                        "DEPARTMENT_REFERENCE"
                                      ? "부서"
                                      : step.assigneeRule}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {step.required ? "필수" : "선택"}
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
                                    {step.assigneeRule === "DRAFTER"
                                      ? "기안자"
                                      : step.assigneeRule === "DRAFTER_SUPERIOR"
                                      ? "상급자"
                                      : step.assigneeRule === "FIXED"
                                      ? "고정직원"
                                      : step.assigneeRule ===
                                        "DEPARTMENT_REFERENCE"
                                      ? "부서"
                                      : step.assigneeRule}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {step.required ? "필수" : "선택"}
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
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white shadow rounded-lg p-6"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            변경 사유 *
          </label>
          <textarea
            rows={3}
            required
            className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="버전 변경 사유를 입력하세요"
            value={versionNote}
            onChange={(e) => setVersionNote(e.target.value)}
            disabled={saving}
          />
        </div>

        {/* 템플릿 내용 편집 */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              문서 템플릿 *
            </label>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setIsPreviewMode(false)}
                className={`px-3 py-1 text-xs font-medium rounded-md ${
                  !isPreviewMode
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                편집
              </button>
              <button
                type="button"
                onClick={() => setIsPreviewMode(true)}
                className={`px-3 py-1 text-xs font-medium rounded-md ${
                  isPreviewMode
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                미리보기
              </button>
            </div>
          </div>

          {!isPreviewMode ? (
            <>
              <textarea
                rows={15}
                required
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm font-mono text-xs"
                placeholder="HTML 템플릿을 입력하세요"
                value={template}
                onChange={(e) => setTemplate(e.target.value)}
                disabled={saving}
              />
              <p className="mt-1 text-xs text-gray-500">
                HTML 템플릿을 입력하세요. 필요시 수정할 수 있습니다.
              </p>
            </>
          ) : (
            <>
              <div
                className="block w-full border border-gray-300 rounded-md shadow-sm py-4 px-4 bg-white min-h-[400px] html-preview"
                dangerouslySetInnerHTML={{ __html: template }}
                style={{
                  maxHeight: "600px",
                  overflowY: "auto",
                }}
              />
              <p className="mt-1 text-xs text-gray-500">
                HTML이 렌더링된 미리보기입니다. 편집하려면 &ldquo;편집&rdquo;
                버튼을 클릭하세요.
              </p>
            </>
          )}
        </div>

        {/* 결재선 변경 옵션 */}
        <div>
          <div className="flex items-center mb-3">
            <input
              type="checkbox"
              id="changeApprovalLine"
              checked={changeApprovalLine}
              onChange={(e) => setChangeApprovalLine(e.target.checked)}
              disabled={saving}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label
              htmlFor="changeApprovalLine"
              className="ml-2 block text-sm font-medium text-gray-700"
            >
              결재선 변경
            </label>
          </div>

          {changeApprovalLine && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                새 결재선 템플릿 선택 *
              </label>
              <select
                required={changeApprovalLine}
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={selectedTemplateVersionId}
                onChange={(e) => setSelectedTemplateVersionId(e.target.value)}
                disabled={saving}
              >
                <option value="">-- 결재선 템플릿 선택 --</option>
                {templates
                  .filter((t) => t.status === "ACTIVE" && t.currentVersionId)
                  .map((template) => (
                    <option key={template.id} value={template.currentVersionId}>
                      {template.name}
                    </option>
                  ))}
              </select>
              <p className="mt-1 text-sm text-gray-500">
                선택한 결재선 템플릿이 새 버전에 적용됩니다.
              </p>
            </div>
          )}
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={() => router.back()}
            disabled={saving}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "저장 중..." : "새 버전 생성"}
          </button>
        </div>
      </form>
    </div>
  );
}
