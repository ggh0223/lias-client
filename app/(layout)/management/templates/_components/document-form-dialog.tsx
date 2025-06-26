"use client";

import { useState, useEffect } from "react";
import {
  DocumentForm,
  CreateDocumentFormRequest,
  UpdateDocumentFormRequest,
  DocumentFormType,
  FormApprovalLine,
  getFormApprovalLinesApi,
} from "@/app/(layout)/_lib/api/document-api";

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
  documentType,
  approvalLine,
  autoFillType,
}: {
  isOpen: boolean;
  onClose: () => void;
  template: string;
  documentType?: DocumentFormType;
  approvalLine?: FormApprovalLine;
  autoFillType: "NONE" | "DRAFTER_ONLY" | "DRAFTER_SUPERIOR";
}) => {
  const [previewHtml, setPreviewHtml] = useState("");

  useEffect(() => {
    if (isOpen && template) {
      // 템플릿의 플레이스홀더를 실제 데이터로 치환
      let html = template;

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

        // 시행자 정보 치환
        const implementationSteps = approvalLine.formApprovalSteps
          .filter((step) => step.type === "IMPLEMENTATION")
          .sort((a, b) => a.order - b.order)
          .map((step) => step.defaultApprover.name)
          .join(", ");
        html = html.replace(
          /\{\{implementationSteps\}\}/g,
          implementationSteps || "시행자 미지정"
        );

        // 수신자/참조자 정보 치환
        const referenceSteps = approvalLine.formApprovalSteps
          .filter((step) => step.type === "REFERENCE")
          .sort((a, b) => a.order - b.order)
          .map((step) => step.defaultApprover.name)
          .join(", ");
        html = html.replace(
          /\{\{referenceSteps\}\}/g,
          referenceSteps || "수신자/참조자 미지정"
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
  }, [isOpen, template, documentType, approvalLine, autoFillType]);

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
              <span className="text-secondary">자동 채우기:</span>
              <span className="ml-2 text-primary">
                {autoFillType === "NONE" && "자동 채우기 없음"}
                {autoFillType === "DRAFTER_ONLY" && "기안자만"}
                {autoFillType === "DRAFTER_SUPERIOR" && "기안자 + 상급자"}
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
          </div>
        </div>

        <div className="border border-border rounded-lg p-4 bg-white">
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: previewHtml }}
          />
        </div>

        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
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
  const [documentTypeId, setDocumentTypeId] = useState("");
  const [formApprovalLineId, setFormApprovalLineId] = useState("");
  const [autoFillType, setAutoFillType] = useState<
    "NONE" | "DRAFTER_ONLY" | "DRAFTER_SUPERIOR"
  >("NONE");
  const [error, setError] = useState<string | null>(null);

  // 모달 상태
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
        const response = await getFormApprovalLinesApi({
          limit: 100,
          type: "COMMON",
        }); // 충분한 수의 결재선 가져오기
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
        setDocumentTypeId(form.documentType.documentTypeId);
        setFormApprovalLineId(form.formApprovalLine?.formApprovalLineId || "");
        setAutoFillType(form.autoFillType);
      } else {
        setName("");
        setDescription("");
        setTemplate("");
        setDocumentTypeId("");
        setFormApprovalLineId("");
        setAutoFillType("NONE");
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

    if (!formApprovalLineId) {
      setError("결재선을 선택해주세요.");
      return;
    }

    try {
      if (isEditMode && form) {
        await onSubmit({
          name: name.trim(),
          description: description.trim() || undefined,
          template: template.trim(),
          documentTypeId,
          formApprovalLineId,
          autoFillType,
          documentFormId: form.documentFormId,
        } as UpdateDocumentFormRequest);
      } else {
        await onSubmit({
          name: name.trim(),
          description: description.trim() || undefined,
          template: template.trim(),
          documentTypeId,
          formApprovalLineId,
          autoFillType,
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
{{documentType}} - 문서 타입
{{documentNumberCode}} - 문서 번호 코드
{{approvalLineName}} - 결재선 이름
{{approvalLineType}} - 결재선 타입
{{approvalSteps}} - 결재 단계 정보 (결재+합의)
{{approvalStepsOnly}} - 결재자만
{{agreementStepsOnly}} - 합의자만
{{implementationSteps}} - 시행자만
{{referenceSteps}} - 수신자/참조자만
{{currentDate}} - 현재 날짜
{{documentNumber}} - 문서 번호`}
              />
            </div>

            <div>
              <label
                htmlFor="formApprovalLineId"
                className="block text-sm font-medium text-primary mb-2"
              >
                결재선 *
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

            <div>
              <label
                htmlFor="autoFillType"
                className="block text-sm font-medium text-primary mb-2"
              >
                자동 채우기 타입
              </label>
              <select
                id="autoFillType"
                value={autoFillType}
                onChange={(e) =>
                  setAutoFillType(
                    e.target.value as
                      | "NONE"
                      | "DRAFTER_ONLY"
                      | "DRAFTER_SUPERIOR"
                  )
                }
                disabled={isLoading}
                className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50"
              >
                <option value="NONE">자동 채우기 없음</option>
                <option value="DRAFTER_ONLY">기안자만</option>
                <option value="DRAFTER_SUPERIOR">기안자 + 상급자</option>
              </select>
              <p className="text-xs text-secondary mt-1">
                문서 작성 시 결재선에 자동으로 추가할 결재자 유형을 선택하세요.
              </p>
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

      {/* 미리보기 모달 */}
      <PreviewModal
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        template={template}
        documentType={selectedDocumentType}
        approvalLine={approvalLines.find(
          (line) => line.formApprovalLineId === formApprovalLineId
        )}
        autoFillType={autoFillType}
      />
    </>
  );
};
