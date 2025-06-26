"use client";

import { useState, useEffect } from "react";
import { DocumentForm } from "@/app/(layout)/_lib/api/document-api";

interface DocumentFormTableProps {
  forms: DocumentForm[];
  onEdit: (form: DocumentForm) => void;
  onDelete: (id: string) => void;
  isLoading?: boolean;
}

// 미리보기 모달 컴포넌트
const PreviewModal = ({
  isOpen,
  onClose,
  form,
}: {
  isOpen: boolean;
  onClose: () => void;
  form: DocumentForm;
}) => {
  const [previewHtml, setPreviewHtml] = useState("");

  useEffect(() => {
    if (isOpen && form.template) {
      // 템플릿의 플레이스홀더를 실제 데이터로 치환
      let html = form.template;

      // 카테고리 정보 치환
      html = html.replace(/\{\{documentType\}\}/g, form.documentType.name);
      html = html.replace(
        /\{\{documentNumberCode\}\}/g,
        form.documentType.documentNumberCode
      );

      // 결재선 정보 치환
      if (form.formApprovalLine) {
        html = html.replace(
          /\{\{approvalLineName\}\}/g,
          form.formApprovalLine.name
        );
        html = html.replace(
          /\{\{approvalLineType\}\}/g,
          form.formApprovalLine.type
        );

        // 결재선 단계 정보 치환
        const approvalSteps = form.formApprovalLine.formApprovalSteps
          .sort((a, b) => a.order - b.order)
          .map((step) => `${step.defaultApprover.name} (${step.type})`)
          .join(" → ");
        html = html.replace(
          /\{\{approvalSteps\}\}/g,
          approvalSteps || "결재선 미지정"
        );

        // 결재와 합의를 분리하여 치환
        const approvalStepsOnly = form.formApprovalLine.formApprovalSteps
          .filter((step) => step.type === "APPROVAL")
          .sort((a, b) => a.order - b.order)
          .map((step) => step.defaultApprover.name)
          .join(" → ");
        html = html.replace(
          /\{\{approvalStepsOnly\}\}/g,
          approvalStepsOnly || "결재자 미지정"
        );

        const agreementStepsOnly = form.formApprovalLine.formApprovalSteps
          .filter((step) => step.type === "AGREEMENT")
          .sort((a, b) => a.order - b.order)
          .map((step) => step.defaultApprover.name)
          .join(" → ");
        html = html.replace(
          /\{\{agreementStepsOnly\}\}/g,
          agreementStepsOnly || "합의자 미지정"
        );

        // 시행자 정보 치환
        const implementationStepsOnly = form.formApprovalLine.formApprovalSteps
          .filter((step) => step.type === "IMPLEMENTATION")
          .sort((a, b) => a.order - b.order)
          .map((step) => step.defaultApprover.name)
          .join(" → ");
        html = html.replace(
          /\{\{implementationStepsOnly\}\}/g,
          implementationStepsOnly || "시행자 미지정"
        );

        // 수신자/참조자 정보 치환
        const referenceStepsOnly = form.formApprovalLine.formApprovalSteps
          .filter((step) => step.type === "REFERENCE")
          .sort((a, b) => a.order - b.order)
          .map((step) => step.defaultApprover.name)
          .join(" → ");
        html = html.replace(
          /\{\{referenceStepsOnly\}\}/g,
          referenceStepsOnly || "수신자/참조자 미지정"
        );
      }

      // 날짜 정보 치환
      const today = new Date();
      const dateStr = today.toLocaleDateString("ko-KR");
      html = html.replace(/\{\{currentDate\}\}/g, dateStr);

      // 문서 번호 생성 (예시)
      const docNumber = `${form.documentType.documentNumberCode}-${Date.now()
        .toString()
        .slice(-6)}`;
      html = html.replace(/\{\{documentNumber\}\}/g, docNumber);

      setPreviewHtml(html);
    }
  }, [isOpen, form]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-surface border border-border rounded-lg p-6 w-full max-w-6xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-primary">
            문서양식 미리보기 - {form.name}
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
            문서양식 정보
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-secondary">양식명:</span>
              <span className="ml-2 text-primary">{form.name}</span>
            </div>
            <div>
              <span className="text-secondary">카테고리:</span>
              <span className="ml-2 text-primary">
                {form.documentType.name}
              </span>
            </div>
            <div>
              <span className="text-secondary">결재선:</span>
              <span className="ml-2 text-primary">
                {form.formApprovalLine?.name || "미지정"}
              </span>
            </div>
            <div>
              <span className="text-secondary">결재선 타입:</span>
              <span className="ml-2 text-primary">
                {form.formApprovalLine?.type || "미지정"}
              </span>
            </div>
            <div>
              <span className="text-secondary">자동 채우기:</span>
              <span className="ml-2 text-primary">
                {form.autoFillType === "NONE" && "자동 채우기 없음"}
                {form.autoFillType === "DRAFTER_ONLY" && "기안자만"}
                {form.autoFillType === "DRAFTER_SUPERIOR" && "기안자 + 상급자"}
              </span>
            </div>
            <div>
              <span className="text-secondary">결재자:</span>
              <span className="ml-2 text-primary">
                {form.formApprovalLine?.formApprovalSteps
                  .filter((step) => step.type === "APPROVAL")
                  .sort((a, b) => a.order - b.order)
                  .map((step) => step.defaultApprover.name)
                  .join(" → ") || "미지정"}
              </span>
            </div>
            <div>
              <span className="text-secondary">합의자:</span>
              <span className="ml-2 text-primary">
                {form.formApprovalLine?.formApprovalSteps
                  .filter((step) => step.type === "AGREEMENT")
                  .sort((a, b) => a.order - b.order)
                  .map((step) => step.defaultApprover.name)
                  .join(" → ") || "미지정"}
              </span>
            </div>
            <div>
              <span className="text-secondary">시행자:</span>
              <span className="ml-2 text-primary">
                {form.formApprovalLine?.formApprovalSteps
                  .filter((step) => step.type === "IMPLEMENTATION")
                  .sort((a, b) => a.order - b.order)
                  .map((step) => step.defaultApprover.name)
                  .join(" → ") || "미지정"}
              </span>
            </div>
            <div>
              <span className="text-secondary">수신자/참조자:</span>
              <span className="ml-2 text-primary">
                {form.formApprovalLine?.formApprovalSteps
                  .filter((step) => step.type === "REFERENCE")
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
                {form.documentType.documentNumberCode}-
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

export const DocumentFormTable = ({
  forms,
  onEdit,
  onDelete,
  isLoading = false,
}: DocumentFormTableProps) => {
  const [previewForm, setPreviewForm] = useState<DocumentForm | null>(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  const handleDelete = (id: string) => {
    if (window.confirm("정말로 이 문서양식을 삭제하시겠습니까?")) {
      onDelete(id);
    }
  };

  const handlePreview = (form: DocumentForm) => {
    setPreviewForm(form);
    setIsPreviewModalOpen(true);
  };

  const handleClosePreview = () => {
    setIsPreviewModalOpen(false);
    setPreviewForm(null);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2 text-secondary">로딩 중...</span>
      </div>
    );
  }

  if (forms.length === 0) {
    return (
      <div className="text-center py-8 text-secondary">
        <p>등록된 문서양식이 없습니다.</p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-surface border-b border-border">
              <th className="text-left p-3 text-sm font-medium text-primary">
                양식명
              </th>
              <th className="text-left p-3 text-sm font-medium text-primary">
                카테고리
              </th>
              <th className="text-left p-3 text-sm font-medium text-primary">
                결재선
              </th>
              <th className="text-left p-3 text-sm font-medium text-primary">
                자동 채우기
              </th>
              <th className="text-left p-3 text-sm font-medium text-primary">
                결재자
              </th>
              <th className="text-left p-3 text-sm font-medium text-primary">
                합의자
              </th>
              <th className="text-left p-3 text-sm font-medium text-primary">
                시행자
              </th>
              <th className="text-left p-3 text-sm font-medium text-primary">
                수신자/참조자
              </th>
              <th className="text-left p-3 text-sm font-medium text-primary">
                작업
              </th>
            </tr>
          </thead>
          <tbody>
            {forms.map((form) => (
              <tr
                key={form.documentFormId}
                className="border-b border-border hover:bg-surface/50"
              >
                <td className="p-3">
                  <div>
                    <div className="font-medium text-primary">{form.name}</div>
                    {form.description && (
                      <div className="text-sm text-secondary mt-1">
                        {form.description}
                      </div>
                    )}
                  </div>
                </td>
                <td className="p-3 text-sm text-primary">
                  {form.documentType.name}
                </td>
                <td className="p-3 text-sm text-primary">
                  {form.formApprovalLine?.name || "미지정"}
                </td>
                <td className="p-3 text-sm text-primary">
                  {form.autoFillType === "NONE" && "자동 채우기 없음"}
                  {form.autoFillType === "DRAFTER_ONLY" && "기안자만"}
                  {form.autoFillType === "DRAFTER_SUPERIOR" &&
                    "기안자 + 상급자"}
                </td>
                <td className="p-3">
                  <div className="flex flex-wrap gap-1">
                    {form.formApprovalLine?.formApprovalSteps
                      ?.filter((step) => step.type === "APPROVAL")
                      .sort((a, b) => a.order - b.order)
                      .slice(0, 2)
                      .map((step) => (
                        <span
                          key={step.formApprovalStepId}
                          className="text-xs bg-primary/10 text-primary px-2 py-1 rounded"
                        >
                          {step.defaultApprover.name}
                        </span>
                      ))}
                    {form.formApprovalLine?.formApprovalSteps &&
                      form.formApprovalLine?.formApprovalSteps?.filter(
                        (step) => step.type === "APPROVAL"
                      )?.length &&
                      form.formApprovalLine?.formApprovalSteps?.filter(
                        (step) => step.type === "APPROVAL"
                      )?.length > 2 && (
                        <span className="text-xs text-secondary">
                          +
                          {form.formApprovalLine?.formApprovalSteps?.filter(
                            (step) => step.type === "APPROVAL"
                          ).length - 2}
                          명
                        </span>
                      )}
                  </div>
                </td>
                <td className="p-3">
                  <div className="flex flex-wrap gap-1">
                    {form.formApprovalLine?.formApprovalSteps
                      ?.filter((step) => step.type === "AGREEMENT")
                      .sort((a, b) => a.order - b.order)
                      .slice(0, 2)
                      .map((step) => (
                        <span
                          key={step.formApprovalStepId}
                          className="text-xs bg-secondary/10 text-secondary px-2 py-1 rounded"
                        >
                          {step.defaultApprover.name}
                        </span>
                      ))}
                    {form.formApprovalLine?.formApprovalSteps &&
                      form.formApprovalLine?.formApprovalSteps?.filter(
                        (step) => step.type === "AGREEMENT"
                      )?.length &&
                      form.formApprovalLine?.formApprovalSteps?.filter(
                        (step) => step.type === "AGREEMENT"
                      )?.length > 2 && (
                        <span className="text-xs text-secondary">
                          +
                          {form.formApprovalLine?.formApprovalSteps?.filter(
                            (step) => step.type === "AGREEMENT"
                          ).length - 2}
                          명
                        </span>
                      )}
                  </div>
                </td>
                <td className="p-3">
                  <div className="flex flex-wrap gap-1">
                    {form.formApprovalLine?.formApprovalSteps
                      ?.filter((step) => step.type === "IMPLEMENTATION")
                      .sort((a, b) => a.order - b.order)
                      .slice(0, 2)
                      .map((step) => (
                        <span
                          key={step.formApprovalStepId}
                          className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded"
                        >
                          {step.defaultApprover.name}
                        </span>
                      ))}
                    {form.formApprovalLine?.formApprovalSteps &&
                      form.formApprovalLine?.formApprovalSteps?.filter(
                        (step) => step.type === "IMPLEMENTATION"
                      )?.length &&
                      form.formApprovalLine?.formApprovalSteps?.filter(
                        (step) => step.type === "IMPLEMENTATION"
                      )?.length > 2 && (
                        <span className="text-xs text-secondary">
                          +
                          {form.formApprovalLine?.formApprovalSteps?.filter(
                            (step) => step.type === "IMPLEMENTATION"
                          ).length - 2}
                          명
                        </span>
                      )}
                  </div>
                </td>
                <td className="p-3">
                  <div className="flex flex-wrap gap-1">
                    {form.formApprovalLine?.formApprovalSteps
                      ?.filter((step) => step.type === "REFERENCE")
                      .sort((a, b) => a.order - b.order)
                      .slice(0, 2)
                      .map((step) => (
                        <span
                          key={step.formApprovalStepId}
                          className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded"
                        >
                          {step.defaultApprover.name}
                        </span>
                      ))}
                    {form.formApprovalLine?.formApprovalSteps &&
                      form.formApprovalLine?.formApprovalSteps?.filter(
                        (step) => step.type === "REFERENCE"
                      )?.length &&
                      form.formApprovalLine?.formApprovalSteps?.filter(
                        (step) => step.type === "REFERENCE"
                      )?.length > 2 && (
                        <span className="text-xs text-secondary">
                          +
                          {form.formApprovalLine?.formApprovalSteps?.filter(
                            (step) => step.type === "REFERENCE"
                          ).length - 2}
                          명
                        </span>
                      )}
                  </div>
                </td>
                <td className="p-3">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handlePreview(form)}
                      className="text-secondary hover:text-primary text-sm"
                    >
                      미리보기
                    </button>
                    <button
                      onClick={() => onEdit(form)}
                      className="text-primary hover:text-primary/80 text-sm"
                    >
                      수정
                    </button>
                    <button
                      onClick={() => handleDelete(form.documentFormId)}
                      className="text-danger hover:text-danger/80 text-sm"
                    >
                      삭제
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 미리보기 모달 */}
      {previewForm && (
        <PreviewModal
          isOpen={isPreviewModalOpen}
          onClose={handleClosePreview}
          form={previewForm}
        />
      )}
    </>
  );
};
