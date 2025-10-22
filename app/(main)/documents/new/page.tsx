"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { clientAuth } from "@/lib/auth-client";
import { apiClient } from "@/lib/api-client";
import type { Form } from "@/types/api";

interface ApprovalStep {
  stepOrder: number;
  stepType: string;
  isRequired: boolean;
  employeeId: string;
  employeeName: string;
  departmentName?: string;
  positionTitle?: string;
  assigneeRule: string;
}

export default function NewDocumentPage() {
  const router = useRouter();
  const contentEditableRef = useRef<HTMLDivElement>(null);
  const [forms, setForms] = useState<Form[]>([]);
  const [selectedFormId, setSelectedFormId] = useState("");
  const [formVersionId, setFormVersionId] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingForms, setLoadingForms] = useState(true);
  const [error, setError] = useState("");
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  // 결재선 미리보기
  const [approvalLinePreview, setApprovalLinePreview] = useState<{
    templateName: string;
    steps: ApprovalStep[];
  } | null>(null);
  const [loadingApprovalLine, setLoadingApprovalLine] = useState(false);

  // 문서양식 목록 조회
  useEffect(() => {
    const fetchForms = async () => {
      const token = clientAuth.getToken();
      if (!token) {
        console.error("❌ 토큰이 없습니다. 로그인 페이지로 이동합니다.");
        router.push("/login");
        return;
      }

      try {
        const formList = await apiClient.getForms(token);

        // ACTIVE 상태의 문서양식만 필터링
        const activeForms = formList.filter((form) => form.status === "ACTIVE");

        setForms(activeForms);

        if (activeForms.length === 0) {
          setError("사용 가능한 문서양식이 없습니다. 관리자에게 문의하세요.");
        }
      } catch (err: unknown) {
        console.error("❌ 문서양식 목록 조회 실패:", err);

        if (err instanceof Error) {
          // 401 Unauthorized - 토큰이 만료되었거나 유효하지 않음
          if (
            err.message.includes("Unauthorized") ||
            err.message.includes("401")
          ) {
            console.error(
              "❌ 인증 실패: 토큰이 만료되었거나 유효하지 않습니다."
            );
            clientAuth.removeToken();
            router.push("/login?error=session_expired");
            return;
          }

          setError(`API 에러: ${err.message}`);
        } else {
          setError("문서양식 목록을 불러오는데 실패했습니다.");
        }
      } finally {
        setLoadingForms(false);
      }
    };

    fetchForms();
  }, [router]);

  // 문서양식 선택 시 버전 정보 조회 및 템플릿 적용
  const handleFormSelect = async (formId: string) => {
    setSelectedFormId(formId);
    setError("");
    setApprovalLinePreview(null);

    if (!formId) {
      setFormVersionId("");
      setTitle("");
      setContent("");
      return;
    }

    const token = clientAuth.getToken();
    if (!token) {
      setError("로그인이 필요합니다.");
      return;
    }

    try {
      const form = forms.find((f) => f.id === formId);
      if (!form || !form.currentVersionId) {
        setError("문서양식의 현재 버전을 찾을 수 없습니다.");
        return;
      }

      // 문서양식 버전 정보 조회
      const formVersion = await apiClient.getFormVersion(
        token,
        formId,
        form.currentVersionId
      );

      // formVersionId 설정
      setFormVersionId(formVersion.id);

      // 제목에 문서양식 이름 자동 입력 (사용자가 수정 가능)
      setTitle(form.name);

      // 템플릿을 내용에 자동 입력
      const templateContent = formVersion.template || "";
      setContent(templateContent);

      // contentEditable div에 직접 설정
      if (contentEditableRef.current) {
        contentEditableRef.current.innerHTML = templateContent;
      }

      // 결재선 미리보기 조회
      await loadApprovalLinePreview(formId, formVersion.id);
    } catch (err: unknown) {
      if (err instanceof Error) {
        // 401 Unauthorized 처리
        if (
          err.message.includes("Unauthorized") ||
          err.message.includes("401")
        ) {
          console.error("❌ 인증 실패: 토큰이 만료되었거나 유효하지 않습니다.");
          clientAuth.removeToken();
          router.push("/login?error=session_expired");
          return;
        }
        setError(err.message);
      } else {
        setError("문서양식 정보를 불러오는데 실패했습니다.");
      }
    }
  };

  // 결재선 미리보기 조회
  const loadApprovalLinePreview = async (
    formId: string,
    formVersionId: string
  ) => {
    const token = clientAuth.getToken();
    if (!token) return;

    setLoadingApprovalLine(true);
    try {
      const preview = await apiClient.previewApprovalLine(token, formId, {
        formVersionId,
      });

      setApprovalLinePreview({
        templateName: preview.templateName,
        steps: preview.steps,
      });
    } catch (err) {
      console.error("결재선 미리보기 로드 실패:", err);
      // 결재선 미리보기 실패는 문서 작성을 막지 않음
    } finally {
      setLoadingApprovalLine(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const token = clientAuth.getToken();
    if (!token) {
      setError("로그인이 필요합니다.");
      setLoading(false);
      return;
    }

    if (!formVersionId) {
      setError("문서양식을 선택해주세요.");
      setLoading(false);
      return;
    }

    try {
      const document = await apiClient.createDocument(token, {
        formVersionId,
        title,
        content,
      });

      router.push(`/documents/${document.id}`);
    } catch (err: unknown) {
      if (err instanceof Error) {
        // 401 Unauthorized 처리
        if (
          err.message.includes("Unauthorized") ||
          err.message.includes("401")
        ) {
          console.error("❌ 인증 실패: 토큰이 만료되었거나 유효하지 않습니다.");
          clientAuth.removeToken();
          router.push("/login?error=session_expired");
          return;
        }
        setError(err.message);
      } else {
        setError("문서 생성에 실패했습니다.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loadingForms) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">새 문서 작성</h1>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-center space-x-2">
            <svg
              className="animate-spin h-5 w-5 text-blue-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <p className="text-center text-gray-500">
              문서양식 목록을 불러오는 중...
            </p>
          </div>
        </div>
      </div>
    );
  }

  const getStepTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      AGREEMENT: "협의",
      APPROVAL: "결재",
      IMPLEMENTATION: "시행",
      REFERENCE: "참조",
    };
    return labels[type] || type;
  };

  const getStepTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      AGREEMENT: "bg-purple-100 text-purple-800",
      APPROVAL: "bg-blue-100 text-blue-800",
      IMPLEMENTATION: "bg-green-100 text-green-800",
      REFERENCE: "bg-gray-100 text-gray-800",
    };
    return colors[type] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">새 문서 작성</h1>
        <p className="mt-1 text-sm text-gray-500">
          새로운 결재 문서를 작성합니다.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 왼쪽: 문서 작성 폼 */}
        <div className="lg:col-span-2">
          <form
            onSubmit={handleSubmit}
            className="space-y-6 bg-white shadow rounded-lg p-6"
          >
            <div>
              <label
                htmlFor="formSelect"
                className="block text-sm font-medium text-gray-700"
              >
                문서양식 선택 <span className="text-red-500">*</span>
              </label>
              <select
                id="formSelect"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={selectedFormId}
                onChange={(e) => handleFormSelect(e.target.value)}
                disabled={loading}
              >
                <option value="">
                  {forms.length === 0
                    ? "사용 가능한 문서양식이 없습니다"
                    : "문서양식을 선택하세요"}
                </option>
                {forms.map((form) => (
                  <option key={form.id} value={form.id}>
                    {form.name}{" "}
                    {form.description ? `- ${form.description}` : ""}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-gray-500">
                문서양식을 선택하면 제목과 내용이 자동으로 채워집니다.
              </p>
            </div>

            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700"
              >
                문서 제목 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="문서 제목을 입력하세요"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={loading || !selectedFormId}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  문서 내용 <span className="text-red-500">*</span>
                </label>
                {selectedFormId && (
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
                )}
              </div>

              {!isPreviewMode ? (
                <>
                  <div
                    ref={contentEditableRef}
                    contentEditable={!loading && selectedFormId !== ""}
                    suppressContentEditableWarning
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-4 px-4 bg-white min-h-[400px] html-preview focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    onInput={(e) => {
                      const target = e.target as HTMLDivElement;
                      setContent(target.innerHTML);
                    }}
                    onBlur={(e) => {
                      const target = e.target as HTMLDivElement;
                      setContent(target.innerHTML);
                    }}
                    style={{
                      maxHeight: "600px",
                      overflowY: "auto",
                    }}
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    문서 내용을 직접 편집할 수 있습니다. 표의 셀을 클릭하여
                    내용을 수정하세요.
                  </p>
                </>
              ) : (
                <>
                  <div
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-4 px-4 bg-gray-50 min-h-[400px] html-preview"
                    dangerouslySetInnerHTML={{ __html: content }}
                    style={{
                      maxHeight: "600px",
                      overflowY: "auto",
                    }}
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    읽기 전용 미리보기입니다. 편집하려면 &ldquo;편집&rdquo;
                    버튼을 클릭하세요.
                  </p>
                </>
              )}
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => router.back()}
                disabled={loading}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={loading || !selectedFormId}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "작성 중..." : "임시저장"}
              </button>
            </div>
          </form>
        </div>

        {/* 오른쪽: 결재선 미리보기 */}
        <div className="lg:col-span-1">
          <div className="bg-white shadow rounded-lg p-6 sticky top-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              결재선 미리보기
            </h2>

            {!selectedFormId ? (
              <div className="text-center py-12">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <p className="mt-4 text-sm text-gray-500">
                  문서양식을 선택하면
                  <br />
                  결재선이 표시됩니다
                </p>
              </div>
            ) : loadingApprovalLine ? (
              <div className="flex items-center justify-center py-12">
                <svg
                  className="animate-spin h-8 w-8 text-blue-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </div>
            ) : approvalLinePreview ? (
              <div className="space-y-4">
                <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                  <p className="text-xs font-medium text-blue-900">
                    {approvalLinePreview.templateName}
                  </p>
                  <p className="text-xs text-blue-700 mt-1">
                    총 {approvalLinePreview.steps.length}단계
                  </p>
                </div>

                <div className="space-y-3">
                  {approvalLinePreview.steps.map((step, index) => (
                    <div
                      key={index}
                      className="relative flex items-start space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white border-2 border-gray-300 text-sm font-semibold text-gray-700">
                          {step.stepOrder}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getStepTypeColor(
                              step.stepType
                            )}`}
                          >
                            {getStepTypeLabel(step.stepType)}
                          </span>
                          {step.isRequired && (
                            <span className="text-red-500 text-xs">*</span>
                          )}
                        </div>
                        <p className="text-sm font-medium text-gray-900">
                          {step.employeeName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {step.departmentName && `${step.departmentName} `}
                          {step.positionTitle && `· ${step.positionTitle}`}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <p className="text-xs text-yellow-800">
                    💡 문서를 임시저장한 후 제출하면 위 결재선으로 상신됩니다.
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-sm text-red-600">
                  결재선을 불러올 수 없습니다
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
