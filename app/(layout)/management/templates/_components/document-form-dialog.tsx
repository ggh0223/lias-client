"use client";

import { useState, useEffect } from "react";
import {
  DocumentForm,
  CreateDocumentFormRequest,
  UpdateDocumentFormRequest,
  DocumentFormType,
  FormApprovalLine,
  getFormApprovalLinesApi,
  EmployeeInfo,
} from "@/app/(layout)/_lib/api/document-api";
import { EmployeeSelectorModal } from "@/app/(layout)/_components/employee-selector-modal";
import { Employee } from "@/app/(layout)/_lib/api/metadata-api";

interface DocumentFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    data: CreateDocumentFormRequest | UpdateDocumentFormRequest
  ) => Promise<void>;
  form?: DocumentForm | null;
  documentTypes: DocumentFormType[];
  isLoading?: boolean;
}

// 미리보기 모달 컴포넌트
const PreviewModal = ({
  isOpen,
  onClose,
  template,
  receiverInfo,
  implementerInfo,
  documentType,
  approvalLine,
}: {
  isOpen: boolean;
  onClose: () => void;
  template: string;
  receiverInfo: EmployeeInfo[];
  implementerInfo: EmployeeInfo[];
  documentType?: DocumentFormType;
  approvalLine?: FormApprovalLine;
}) => {
  const [previewHtml, setPreviewHtml] = useState("");

  useEffect(() => {
    if (isOpen && template) {
      // 템플릿의 플레이스홀더를 실제 데이터로 치환
      let html = template;

      // 수신자 정보 치환
      const receiverNames = receiverInfo.map((emp) => emp.name).join(", ");
      html = html.replace(
        /\{\{receiverInfo\}\}/g,
        receiverNames || "수신자 미지정"
      );

      // 시행자 정보 치환
      const implementerNames = implementerInfo
        .map((emp) => emp.name)
        .join(", ");
      html = html.replace(
        /\{\{implementerInfo\}\}/g,
        implementerNames || "시행자 미지정"
      );

      // 카테고리 정보 치환
      if (documentType) {
        html = html.replace(/\{\{documentType\}\}/g, documentType.name);
        html = html.replace(
          /\{\{documentNumberCode\}\}/g,
          documentType.documentNumberCode
        );
      }

      // 결재선 정보 치환
      if (approvalLine) {
        html = html.replace(/\{\{approvalLineName\}\}/g, approvalLine.name);
        html = html.replace(/\{\{approvalLineType\}\}/g, approvalLine.type);

        // 결재선 단계 정보 치환
        const approvalSteps = approvalLine.formApprovalSteps
          .sort((a, b) => a.order - b.order)
          .map((step) => `${step.defaultApprover.name} (${step.type})`)
          .join(" → ");
        html = html.replace(
          /\{\{approvalSteps\}\}/g,
          approvalSteps || "결재선 미지정"
        );

        // 결재와 합의를 분리하여 치환
        const approvalStepsOnly = approvalLine.formApprovalSteps
          .filter((step) => step.type === "APPROVAL")
          .sort((a, b) => a.order - b.order)
          .map((step) => step.defaultApprover.name)
          .join(" → ");
        html = html.replace(
          /\{\{approvalStepsOnly\}\}/g,
          approvalStepsOnly || "결재자 미지정"
        );

        const agreementStepsOnly = approvalLine.formApprovalSteps
          .filter((step) => step.type === "AGREEMENT")
          .sort((a, b) => a.order - b.order)
          .map((step) => step.defaultApprover.name)
          .join(" → ");
        html = html.replace(
          /\{\{agreementStepsOnly\}\}/g,
          agreementStepsOnly || "합의자 미지정"
        );
      }

      // 날짜 정보 치환
      const today = new Date();
      const dateStr = today.toLocaleDateString("ko-KR");
      html = html.replace(/\{\{currentDate\}\}/g, dateStr);

      // 문서 번호 생성 (예시)
      const docNumber = `${
        documentType?.documentNumberCode || "DOC"
      }-${Date.now().toString().slice(-6)}`;
      html = html.replace(/\{\{documentNumber\}\}/g, docNumber);

      setPreviewHtml(html);
    }
  }, [
    isOpen,
    template,
    receiverInfo,
    implementerInfo,
    documentType,
    approvalLine,
  ]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-surface border border-border rounded-lg p-6 w-full max-w-6xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-primary">
            문서양식 미리보기
          </h2>
          <button
            onClick={onClose}
            className="text-secondary hover:text-primary"
          >
            ✕
          </button>
        </div>

        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium text-primary mb-2">
            미리보기 정보
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-secondary">수신자:</span>
              <span className="ml-2 text-primary">
                {receiverInfo.length > 0
                  ? receiverInfo.map((emp) => emp.name).join(", ")
                  : "미지정"}
              </span>
            </div>
            <div>
              <span className="text-secondary">시행자:</span>
              <span className="ml-2 text-primary">
                {implementerInfo.length > 0
                  ? implementerInfo.map((emp) => emp.name).join(", ")
                  : "미지정"}
              </span>
            </div>
            <div>
              <span className="text-secondary">카테고리:</span>
              <span className="ml-2 text-primary">
                {documentType?.name || "미지정"}
              </span>
            </div>
            <div>
              <span className="text-secondary">결재선:</span>
              <span className="ml-2 text-primary">
                {approvalLine?.name || "미지정"}
              </span>
            </div>
            <div>
              <span className="text-secondary">결재선 타입:</span>
              <span className="ml-2 text-primary">
                {approvalLine?.type || "미지정"}
              </span>
            </div>
            <div>
              <span className="text-secondary">결재 단계:</span>
              <span className="ml-2 text-primary">
                {approvalLine?.formApprovalSteps
                  .sort((a, b) => a.order - b.order)
                  .map((step) => step.defaultApprover.name)
                  .join(" → ") || "미지정"}
              </span>
            </div>
            <div>
              <span className="text-secondary">결재자:</span>
              <span className="ml-2 text-primary">
                {approvalLine?.formApprovalSteps
                  .filter((step) => step.type === "APPROVAL")
                  .sort((a, b) => a.order - b.order)
                  .map((step) => step.defaultApprover.name)
                  .join(" → ") || "미지정"}
              </span>
            </div>
            <div>
              <span className="text-secondary">합의자:</span>
              <span className="ml-2 text-primary">
                {approvalLine?.formApprovalSteps
                  .filter((step) => step.type === "AGREEMENT")
                  .sort((a, b) => a.order - b.order)
                  .map((step) => step.defaultApprover.name)
                  .join(" → ") || "미지정"}
              </span>
            </div>
            <div>
              <span className="text-secondary">생성일:</span>
              <span className="ml-2 text-primary">
                {new Date().toLocaleDateString("ko-KR")}
              </span>
            </div>
            <div>
              <span className="text-secondary">문서번호:</span>
              <span className="ml-2 text-primary">
                {documentType?.documentNumberCode || "DOC"}-
                {Date.now().toString().slice(-6)}
              </span>
            </div>
          </div>
        </div>

        <div className="border border-border rounded-lg overflow-hidden">
          <div className="bg-white p-8 min-h-[500px]">
            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: previewHtml }}
            />
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-border rounded-lg text-secondary hover:bg-surface"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export const DocumentFormDialog = ({
  isOpen,
  onClose,
  onSubmit,
  form,
  documentTypes,
  isLoading = false,
}: DocumentFormDialogProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [template, setTemplate] = useState("");
  const [receiverInfo, setReceiverInfo] = useState<EmployeeInfo[]>([]);
  const [implementerInfo, setImplementerInfo] = useState<EmployeeInfo[]>([]);
  const [documentTypeId, setDocumentTypeId] = useState("");
  const [formApprovalLineId, setFormApprovalLineId] = useState("");
  const [error, setError] = useState<string | null>(null);

  // 모달 상태
  const [isReceiverModalOpen, setIsReceiverModalOpen] = useState(false);
  const [isImplementerModalOpen, setIsImplementerModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  // 결재선 목록
  const [approvalLines, setApprovalLines] = useState<FormApprovalLine[]>([]);
  const [loadingApprovalLines, setLoadingApprovalLines] = useState(false);

  const isEditMode = !!form;

  // 선택된 카테고리 정보
  const selectedDocumentType = documentTypes.find(
    (type) => type.documentTypeId === documentTypeId
  );

  // 결재선 목록 로드
  useEffect(() => {
    const loadApprovalLines = async () => {
      try {
        setLoadingApprovalLines(true);
        const response = await getFormApprovalLinesApi({ limit: 100 }); // 충분한 수의 결재선 가져오기
        setApprovalLines(response.items);
      } catch (error) {
        console.error("결재선 목록 로드 실패:", error);
        setError("결재선 목록을 불러오는데 실패했습니다.");
      } finally {
        setLoadingApprovalLines(false);
      }
    };

    if (isOpen) {
      loadApprovalLines();
    }
  }, [isOpen]);

  // 폼 초기화
  useEffect(() => {
    if (isOpen) {
      if (isEditMode && form) {
        setName(form.name);
        setDescription(form.description || "");
        setTemplate(form.template);
        setReceiverInfo(form.receiverInfo || []);
        setImplementerInfo(form.implementerInfo || []);
        setDocumentTypeId(form.documentType.documentTypeId);
        setFormApprovalLineId(form.formApprovalLine?.formApprovalLineId || "");
      } else {
        setName("");
        setDescription("");
        setTemplate("");
        setReceiverInfo([]);
        setImplementerInfo([]);
        setDocumentTypeId("");
        setFormApprovalLineId("");
      }
      setError(null);
    }
  }, [isOpen, isEditMode, form]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("양식명을 입력해주세요.");
      return;
    }

    if (!template.trim()) {
      setError("템플릿을 입력해주세요.");
      return;
    }

    if (!documentTypeId) {
      setError("카테고리를 선택해주세요.");
      return;
    }

    try {
      if (isEditMode && form) {
        await onSubmit({
          name: name.trim(),
          description: description.trim() || undefined,
          template: template.trim(),
          receiverInfo: receiverInfo.length > 0 ? receiverInfo : undefined,
          implementerInfo:
            implementerInfo.length > 0 ? implementerInfo : undefined,
          documentTypeId,
          formApprovalLineId: formApprovalLineId || undefined,
          documentFormId: form.documentFormId,
        } as UpdateDocumentFormRequest);
      } else {
        await onSubmit({
          name: name.trim(),
          description: description.trim() || undefined,
          template: template.trim(),
          receiverInfo: receiverInfo.length > 0 ? receiverInfo : undefined,
          implementerInfo:
            implementerInfo.length > 0 ? implementerInfo : undefined,
          documentTypeId,
          formApprovalLineId: formApprovalLineId || undefined,
        } as CreateDocumentFormRequest);
      }
      onClose();
    } catch {
      // 에러는 상위 컴포넌트에서 처리됨
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  const handlePreview = () => {
    if (!template.trim()) {
      setError("미리보기를 위해 템플릿을 입력해주세요.");
      return;
    }
    setIsPreviewModalOpen(true);
  };

  const handleReceiverSelect = (selectedEmployees: Employee[]) => {
    const employeeInfos: EmployeeInfo[] = selectedEmployees.map((emp) => ({
      employeeId: emp.employeeId,
      name: emp.name,
      rank: emp.rank,
    }));
    setReceiverInfo(employeeInfos);
    setIsReceiverModalOpen(false);
  };

  const handleImplementerSelect = (selectedEmployees: Employee[]) => {
    const employeeInfos: EmployeeInfo[] = selectedEmployees.map((emp) => ({
      employeeId: emp.employeeId,
      name: emp.name,
      rank: emp.rank,
    }));
    setImplementerInfo(employeeInfos);
    setIsImplementerModalOpen(false);
  };

  const removeReceiver = (employeeId: string) => {
    setReceiverInfo(
      receiverInfo.filter((emp) => emp.employeeId !== employeeId)
    );
  };

  const removeImplementer = (employeeId: string) => {
    setImplementerInfo(
      implementerInfo.filter((emp) => emp.employeeId !== employeeId)
    );
  };

  // EmployeeInfo를 Employee로 변환하는 함수 (모달에서 사용)
  const convertToEmployee = (employeeInfo: EmployeeInfo): Employee => ({
    employeeId: employeeInfo.employeeId,
    name: employeeInfo.name,
    employeeNumber: "", // API에서 제공하지 않는 경우 빈 문자열
    email: "", // API에서 제공하지 않는 경우 빈 문자열
    department: "",
    position: "",
    rank: employeeInfo.rank,
  });

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-surface border border-border rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-primary">
              {isEditMode ? "문서양식 수정" : "문서양식 생성"}
            </h2>
            <button
              onClick={handleClose}
              disabled={isLoading}
              className="text-secondary hover:text-primary disabled:opacity-50"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-primary mb-2"
                >
                  양식명 *
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isLoading}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-primary placeholder:text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50"
                  placeholder="예: 휴가신청서"
                />
              </div>

              <div>
                <label
                  htmlFor="documentTypeId"
                  className="block text-sm font-medium text-primary mb-2"
                >
                  카테고리 *
                </label>
                <select
                  id="documentTypeId"
                  value={documentTypeId}
                  onChange={(e) => setDocumentTypeId(e.target.value)}
                  disabled={isLoading}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50"
                >
                  <option value="">카테고리 선택</option>
                  {documentTypes.map((type) => (
                    <option
                      key={type.documentTypeId}
                      value={type.documentTypeId}
                    >
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-primary mb-2"
              >
                설명
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isLoading}
                rows={3}
                className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-primary placeholder:text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50"
                placeholder="문서양식에 대한 설명을 입력하세요"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="template"
                  className="block text-sm font-medium text-primary"
                >
                  템플릿 *
                </label>
                <button
                  type="button"
                  onClick={handlePreview}
                  disabled={!template.trim() || isLoading}
                  className="text-sm text-primary hover:text-primary/80 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  미리보기
                </button>
              </div>
              <textarea
                id="template"
                value={template}
                onChange={(e) => setTemplate(e.target.value)}
                disabled={isLoading}
                rows={10}
                className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-primary placeholder:text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 font-mono text-sm"
                placeholder={`HTML 템플릿을 입력하세요

사용 가능한 플레이스홀더:
{{receiverInfo}} - 수신자 정보
{{implementerInfo}} - 시행자 정보
{{documentType}} - 문서 타입
{{documentNumberCode}} - 문서 번호 코드
{{approvalLineName}} - 결재선 이름
{{approvalLineType}} - 결재선 타입
{{approvalSteps}} - 결재 단계 정보 (결재+합의)
{{approvalStepsOnly}} - 결재자만
{{agreementStepsOnly}} - 합의자만
{{currentDate}} - 현재 날짜
{{documentNumber}} - 문서 번호`}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  수신 및 참조자 정보
                </label>
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => setIsReceiverModalOpen(true)}
                    disabled={isLoading}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-primary hover:bg-surface/80 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50"
                  >
                    + 수신자/참조자 선택
                  </button>
                  {receiverInfo.length > 0 && (
                    <div className="border border-border rounded-lg p-3 max-h-32 overflow-y-auto">
                      <div className="flex flex-wrap gap-1">
                        {receiverInfo.map((employee) => (
                          <div
                            key={employee.employeeId}
                            className="flex items-center space-x-1 bg-primary/10 border border-primary/20 rounded px-2 py-1"
                          >
                            <span className="text-xs text-primary">
                              {employee.name} ({employee.rank})
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                removeReceiver(employee.employeeId)
                              }
                              className="text-primary hover:text-primary/80"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  시행자 정보
                </label>
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => setIsImplementerModalOpen(true)}
                    disabled={isLoading}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-primary hover:bg-surface/80 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50"
                  >
                    + 시행자 선택
                  </button>
                  {implementerInfo.length > 0 && (
                    <div className="border border-border rounded-lg p-3 max-h-32 overflow-y-auto">
                      <div className="flex flex-wrap gap-1">
                        {implementerInfo.map((employee) => (
                          <div
                            key={employee.employeeId}
                            className="flex items-center space-x-1 bg-secondary/10 border border-secondary/20 rounded px-2 py-1"
                          >
                            <span className="text-xs text-secondary">
                              {employee.name} ({employee.rank})
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                removeImplementer(employee.employeeId)
                              }
                              className="text-secondary hover:text-secondary/80"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label
                htmlFor="formApprovalLineId"
                className="block text-sm font-medium text-primary mb-2"
              >
                결재선
              </label>
              <select
                id="formApprovalLineId"
                value={formApprovalLineId}
                onChange={(e) => setFormApprovalLineId(e.target.value)}
                disabled={isLoading || loadingApprovalLines}
                className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50"
              >
                <option value="">
                  {loadingApprovalLines
                    ? "결재선 목록 로딩 중..."
                    : "결재선 선택"}
                </option>
                {approvalLines.map((line) => (
                  <option
                    key={line.formApprovalLineId}
                    value={line.formApprovalLineId}
                  >
                    {line.name} ({line.type})
                  </option>
                ))}
              </select>
            </div>

            {error && (
              <div className="text-danger text-sm bg-danger/10 border border-danger/20 rounded-lg p-3">
                {error}
              </div>
            )}

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                disabled={isLoading}
                className="px-4 py-2 border border-border rounded-lg text-secondary hover:bg-surface disabled:opacity-50"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50"
              >
                {isLoading ? "처리 중..." : isEditMode ? "수정" : "생성"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* 수신자/참조자 선택 모달 */}
      <EmployeeSelectorModal
        isOpen={isReceiverModalOpen}
        onClose={() => setIsReceiverModalOpen(false)}
        onSelect={handleReceiverSelect}
        selectedEmployees={receiverInfo.map(convertToEmployee)}
        title="수신자/참조자 선택"
        multiple={true}
      />

      {/* 시행자 선택 모달 */}
      <EmployeeSelectorModal
        isOpen={isImplementerModalOpen}
        onClose={() => setIsImplementerModalOpen(false)}
        onSelect={handleImplementerSelect}
        selectedEmployees={implementerInfo.map(convertToEmployee)}
        title="시행자 선택"
        multiple={true}
      />

      {/* 미리보기 모달 */}
      <PreviewModal
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        template={template}
        receiverInfo={receiverInfo}
        implementerInfo={implementerInfo}
        documentType={selectedDocumentType}
        approvalLine={approvalLines.find(
          (line) => line.formApprovalLineId === formApprovalLineId
        )}
      />
    </>
  );
};
