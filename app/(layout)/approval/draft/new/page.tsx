"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  DocumentForm,
  getDocumentForms,
  getDocumentForm,
} from "../../../_lib/api/document-api";
import {
  useCreateApprovalDocument,
  CreateDraftDocumentDto,
} from "../../../_hooks/use-approval-documents";
import { getUserInfo } from "../../../_lib/auth/auth-utils";

// 결재 단계 타입 정의
interface ApprovalStep {
  type: string;
  order: number;
  approverId: string;
}

// 파일 업로드 타입
interface UploadedFile {
  fileId: string;
  fileName: string;
  filePath: string;
  createdAt: string;
}

export default function NewDraftPage() {
  const router = useRouter();
  const {
    createDocument,
    loading: createLoading,
    error: createError,
  } = useCreateApprovalDocument();

  // 상태 관리
  const [selectedForm, setSelectedForm] = useState<DocumentForm | null>(null);
  const [availableForms, setAvailableForms] = useState<DocumentForm[]>([]);
  const [loadingForms, setLoadingForms] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<{ name: string } | null>(null);

  // 문서 데이터
  const [documentData, setDocumentData] = useState<
    Partial<CreateDraftDocumentDto>
  >({
    documentNumber: "",
    documentType: "",
    title: "",
    content: "",
    drafterId: "",
    approvalSteps: [],
    files: [],
  });

  // 파일 업로드 상태
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [uploadingFiles, setUploadingFiles] = useState(false);

  // 페이지 진입 시 현재 사용자 정보 로드
  useEffect(() => {
    const userInfo = getUserInfo();
    if (userInfo) {
      setCurrentUser({
        name: userInfo.name,
      });
      // 기안자 ID는 서버에서 토큰을 통해 자동으로 설정되므로 빈 문자열로 유지
      setDocumentData((prev) => ({
        ...prev,
        drafterId: "", // 서버에서 토큰을 통해 자동 설정
      }));
    }
  }, []);

  // 문서 양식 목록 로드
  useEffect(() => {
    const loadDocumentForms = async () => {
      try {
        setLoadingForms(true);
        setFormError(null);
        const response = await getDocumentForms({ limit: 100 });
        setAvailableForms(response.items);
      } catch (error) {
        setFormError(
          error instanceof Error
            ? error.message
            : "문서 양식 로드에 실패했습니다."
        );
      } finally {
        setLoadingForms(false);
      }
    };

    loadDocumentForms();
  }, []);

  // 양식 선택 시 기본값 설정
  const handleFormSelect = async (formId: string) => {
    try {
      const form = await getDocumentForm(formId);
      setSelectedForm(form);

      // 기본값 설정
      setDocumentData((prev: Partial<CreateDraftDocumentDto>) => ({
        ...prev,
        documentNumber: form.documentType.documentNumberCode, // 문서타입 코드만 표시
        documentType: form.documentType.name,
        title: form.name,
        content: form.template || "",
        drafterId: "", // 서버에서 토큰을 통해 자동 설정
        approvalSteps:
          form.formApprovalLine?.formApprovalSteps.map((step) => ({
            type: step.type,
            order: step.order,
            approverId: step.defaultApprover.employeeId,
          })) || [],
        files: [], // 새 문서이므로 빈 배열로 초기화
      }));

      // 기존 업로드된 파일들 초기화 (새 양식 선택 시)
      setUploadedFiles([]);
    } catch (error) {
      console.error("양식 상세 조회 실패:", error);
      alert("문서양식 정보를 불러오는데 실패했습니다.");
    }
  };

  // 입력 필드 변경 핸들러
  const handleInputChange = (
    field: keyof CreateDraftDocumentDto,
    value: unknown
  ) => {
    setDocumentData((prev: Partial<CreateDraftDocumentDto>) => ({
      ...prev,
      [field]: value,
    }));
  };

  // 파일 업로드 핸들러
  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploadingFiles(true);
    try {
      // 실제 파일 업로드 API 호출 (임시로 모킹)
      const uploadedFileList: UploadedFile[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        // 실제로는 파일 업로드 API를 호출해야 함
        const mockUploadedFile: UploadedFile = {
          fileId: `file-${Date.now()}-${i}`,
          fileName: file.name,
          filePath: `/uploads/${file.name}`,
          createdAt: new Date().toISOString(),
        };
        uploadedFileList.push(mockUploadedFile);
      }

      setUploadedFiles((prev) => [...prev, ...uploadedFileList]);
      setDocumentData((prev) => ({
        ...prev,
        files: [...(prev.files || []), ...uploadedFileList],
      }));
    } catch (error) {
      console.error("파일 업로드 실패:", error);
      alert("파일 업로드에 실패했습니다.");
    } finally {
      setUploadingFiles(false);
    }
  };

  // 파일 삭제 핸들러
  const handleFileDelete = (fileId: string) => {
    setUploadedFiles((prev) => prev.filter((file) => file.fileId !== fileId));
    setDocumentData((prev) => ({
      ...prev,
      files: prev.files?.filter((file) => file.fileId !== fileId) || [],
    }));
  };

  // 문서 저장
  const handleSave = async () => {
    if (!documentData.title || !documentData.content) {
      alert("제목과 내용을 입력해주세요.");
      return;
    }

    if (
      !documentData.approvalSteps ||
      documentData.approvalSteps.length === 0
    ) {
      alert("결재선을 설정해주세요.");
      return;
    }

    try {
      const draftData: CreateDraftDocumentDto = {
        documentNumber: documentData.documentNumber || "",
        documentType: documentData.documentType || "",
        title: documentData.title,
        content: documentData.content,
        drafterId: "", // 서버에서 토큰을 통해 자동 설정
        approvalSteps: documentData.approvalSteps,
        parentDocumentId: documentData.parentDocumentId,
        files: documentData.files || [],
      };

      await createDocument(draftData);
      alert("문서가 성공적으로 저장되었습니다.");
      router.push("/approval/draft");
    } catch (error) {
      console.error("문서 저장 실패:", error);
      alert("문서 저장에 실패했습니다.");
    }
  };

  // 취소
  const handleCancel = () => {
    if (confirm("작성 중인 내용이 사라집니다. 정말 취소하시겠습니까?")) {
      router.push("/approval/draft");
    }
  };

  return (
    <div className="space-y-6">
      {/* 페이지 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">새 문서 작성</h1>
          <p className="text-secondary mt-1">
            문서 양식을 선택하고 내용을 작성하세요
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleCancel}
            className="px-4 py-2 border border-border rounded-lg bg-surface text-secondary hover:bg-surface/80 transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            disabled={createLoading}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {createLoading ? "저장 중..." : "저장"}
          </button>
        </div>
      </div>

      {/* 에러 메시지 */}
      {(createError || formError) && (
        <div className="p-4 bg-danger/10 border border-danger/20 rounded-lg">
          <p className="text-danger text-sm">{createError || formError}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 왼쪽: 양식 선택 및 기본 정보 */}
        <div className="lg:col-span-1 space-y-6">
          {/* 문서 양식 선택 */}
          <div className="bg-surface border border-border rounded-lg p-6">
            <h2 className="text-lg font-semibold text-primary mb-4">
              문서 양식 선택
            </h2>
            {loadingForms ? (
              <div className="text-center text-secondary">양식 로딩 중...</div>
            ) : (
              <div className="space-y-2">
                {availableForms.map((form) => (
                  <button
                    key={form.documentFormId}
                    onClick={() => handleFormSelect(form.documentFormId)}
                    className={`w-full p-3 text-left rounded-lg border transition-colors ${
                      selectedForm?.documentFormId === form.documentFormId
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border bg-surface hover:bg-surface/80 text-secondary"
                    }`}
                  >
                    <div className="font-medium">{form.name}</div>
                    <div className="text-sm mt-1">{form.description}</div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 기안자 정보 */}
          <div className="bg-surface border border-border rounded-lg p-6">
            <h2 className="text-lg font-semibold text-primary mb-4">
              기안자 정보
            </h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">
                  기안자
                </label>
                <div className="p-3 bg-surface/50 border border-border rounded-lg">
                  <span className="text-primary font-medium">
                    {currentUser?.name || "사용자 정보를 불러오는 중..."}
                  </span>
                </div>
              </div>
            </div>
            <p className="text-xs text-secondary mt-3">
              기안자 정보는 서버에서 자동으로 설정됩니다.
            </p>
          </div>

          {/* 결재선 설정 */}
          {selectedForm &&
            documentData.approvalSteps &&
            documentData.approvalSteps.length > 0 && (
              <div className="bg-surface border border-border rounded-lg p-6">
                <h2 className="text-lg font-semibold text-primary mb-4">
                  결재선 설정
                </h2>
                <div className="space-y-4">
                  {/* 결재자 */}
                  {documentData.approvalSteps.filter(
                    (step: ApprovalStep) => step.type === "APPROVAL"
                  ).length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-primary mb-2">
                        결재자
                      </h3>
                      <div className="space-y-2">
                        {documentData.approvalSteps
                          .filter(
                            (step: ApprovalStep) => step.type === "APPROVAL"
                          )
                          .map((step: ApprovalStep, index: number) => {
                            const approver =
                              selectedForm.formApprovalLine?.formApprovalSteps.find(
                                (s) =>
                                  s.type === "APPROVAL" &&
                                  s.order === step.order
                              );
                            return (
                              <div
                                key={index}
                                className="p-2 border border-primary/20 rounded-lg bg-primary/5"
                              >
                                <div className="text-sm text-primary">
                                  <span className="font-medium">
                                    결재자 {step.order}단계
                                  </span>
                                  {approver && (
                                    <div className="text-xs text-primary/80 mt-1">
                                      {approver.defaultApprover.name} (
                                      {approver.defaultApprover.position})
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  )}

                  {/* 합의자 */}
                  {documentData.approvalSteps.filter(
                    (step: ApprovalStep) => step.type === "AGREEMENT"
                  ).length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-secondary mb-2">
                        합의자
                      </h3>
                      <div className="space-y-2">
                        {documentData.approvalSteps
                          .filter(
                            (step: ApprovalStep) => step.type === "AGREEMENT"
                          )
                          .map((step: ApprovalStep, index: number) => {
                            const approver =
                              selectedForm.formApprovalLine?.formApprovalSteps.find(
                                (s) =>
                                  s.type === "AGREEMENT" &&
                                  s.order === step.order
                              );
                            return (
                              <div
                                key={index}
                                className="p-2 border border-secondary/20 rounded-lg bg-secondary/5"
                              >
                                <div className="text-sm text-secondary">
                                  <span className="font-medium">
                                    합의자 {step.order}단계
                                  </span>
                                  {approver && (
                                    <div className="text-xs text-secondary/80 mt-1">
                                      {approver.defaultApprover.name} (
                                      {approver.defaultApprover.position})
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  )}

                  {/* 시행자 */}
                  {documentData.approvalSteps.filter(
                    (step: ApprovalStep) => step.type === "IMPLEMENTATION"
                  ).length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-warning mb-2">
                        시행자
                      </h3>
                      <div className="space-y-2">
                        {documentData.approvalSteps
                          .filter(
                            (step: ApprovalStep) =>
                              step.type === "IMPLEMENTATION"
                          )
                          .map((step: ApprovalStep, index: number) => {
                            const approver =
                              selectedForm.formApprovalLine?.formApprovalSteps.find(
                                (s) =>
                                  s.type === "IMPLEMENTATION" &&
                                  s.order === step.order
                              );
                            return (
                              <div
                                key={index}
                                className="p-2 border border-warning/20 rounded-lg bg-warning/5"
                              >
                                <div className="text-sm text-warning">
                                  <span className="font-medium">
                                    시행자 {step.order}단계
                                  </span>
                                  {approver && (
                                    <div className="text-xs text-warning/80 mt-1">
                                      {approver.defaultApprover.name} (
                                      {approver.defaultApprover.position})
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  )}

                  {/* 수신자/참조자 */}
                  {documentData.approvalSteps.filter(
                    (step: ApprovalStep) => step.type === "REFERENCE"
                  ).length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-info mb-2">
                        수신자/참조자
                      </h3>
                      <div className="space-y-2">
                        {documentData.approvalSteps
                          .filter(
                            (step: ApprovalStep) => step.type === "REFERENCE"
                          )
                          .map((step: ApprovalStep, index: number) => {
                            const approver =
                              selectedForm.formApprovalLine?.formApprovalSteps.find(
                                (s) =>
                                  s.type === "REFERENCE" &&
                                  s.order === step.order
                              );
                            return (
                              <div
                                key={index}
                                className="p-2 border border-info/20 rounded-lg bg-info/5"
                              >
                                <div className="text-sm text-info">
                                  <span className="font-medium">
                                    수신자/참조자 {step.order}단계
                                  </span>
                                  {approver && (
                                    <div className="text-xs text-info/80 mt-1">
                                      {approver.defaultApprover.name} (
                                      {approver.defaultApprover.position})
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

          {/* 파일 업로드 */}
          <div className="bg-surface border border-border rounded-lg p-6">
            <h2 className="text-lg font-semibold text-primary mb-4">
              첨부 파일
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary mb-2">
                  파일 선택
                </label>
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  disabled={uploadingFiles}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90"
                />
                {uploadingFiles && (
                  <p className="text-xs text-secondary mt-1">
                    파일 업로드 중...
                  </p>
                )}
              </div>

              {/* 업로드된 파일 목록 */}
              {uploadedFiles.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-secondary mb-2">
                    업로드된 파일
                  </h3>
                  <div className="space-y-2">
                    {uploadedFiles.map((file) => (
                      <div
                        key={file.fileId}
                        className="flex items-center justify-between p-2 bg-surface/50 border border-border rounded-lg"
                      >
                        <span className="text-sm text-primary truncate">
                          {file.fileName}
                        </span>
                        <button
                          onClick={() => handleFileDelete(file.fileId)}
                          className="text-danger hover:text-danger/80 text-sm"
                        >
                          삭제
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 오른쪽: 문서 내용 작성 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 기본 정보 */}
          <div className="bg-surface border border-border rounded-lg p-6">
            <h2 className="text-lg font-semibold text-primary mb-4">
              기본 정보
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary mb-2">
                  문서 번호
                </label>
                <input
                  type="text"
                  value={documentData.documentNumber || ""}
                  onChange={(e) =>
                    handleInputChange("documentNumber", e.target.value)
                  }
                  placeholder="문서 번호를 입력하세요"
                  className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary mb-2">
                  문서 유형
                </label>
                <input
                  type="text"
                  value={documentData.documentType || ""}
                  onChange={(e) =>
                    handleInputChange("documentType", e.target.value)
                  }
                  placeholder="문서 유형을 입력하세요"
                  className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* 문서 내용 */}
          <div className="bg-surface border border-border rounded-lg p-6">
            <h2 className="text-lg font-semibold text-primary mb-4">
              문서 내용
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary mb-2">
                  제목
                </label>
                <input
                  type="text"
                  value={documentData.title || ""}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="문서 제목을 입력하세요"
                  className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary mb-2">
                  내용
                </label>
                <textarea
                  value={documentData.content || ""}
                  onChange={(e) => handleInputChange("content", e.target.value)}
                  placeholder="문서 내용을 입력하세요"
                  rows={15}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
