"use client";

import { FormApprovalLine } from "../../../_lib/api/document-api";

interface ApprovalLineDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  approvalLine: FormApprovalLine | null;
}

export const ApprovalLineDetailDialog = ({
  isOpen,
  onClose,
  approvalLine,
}: ApprovalLineDetailDialogProps) => {
  if (!isOpen || !approvalLine) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "COMMON":
        return "공통";
      case "CUSTOM":
        return "개인화";
      default:
        return type;
    }
  };

  const getStepTypeLabel = (type: string) => {
    switch (type) {
      case "APPROVAL":
        return "결재";
      case "AGREEMENT":
        return "합의";
      case "IMPLEMENTATION":
        return "시행";
      case "REFERENCE":
        return "수신/참조";
      default:
        return type;
    }
  };

  const getStepTypeColor = (type: string) => {
    switch (type) {
      case "APPROVAL":
        return "bg-primary/10 text-primary border-primary/20";
      case "AGREEMENT":
        return "bg-secondary/10 text-secondary border-secondary/20";
      case "IMPLEMENTATION":
        return "bg-warning/10 text-warning border-warning/20";
      case "REFERENCE":
        return "bg-info/10 text-info border-info/20";
      default:
        return "bg-gray/10 text-gray border-gray/20";
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-surface rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-primary">
            결재선 상세 정보
          </h2>
          <button
            onClick={onClose}
            className="text-secondary hover:text-primary transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="space-y-6">
          {/* 기본 정보 */}
          <div className="bg-surface/50 rounded-lg p-4">
            <h3 className="text-lg font-medium text-primary mb-4">기본 정보</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">
                  결재선 ID
                </label>
                <p className="text-sm text-primary font-mono">
                  {approvalLine.formApprovalLineId}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">
                  결재선명
                </label>
                <p className="text-sm text-primary font-medium">
                  {approvalLine.name}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">
                  설명
                </label>
                <p className="text-sm text-primary">
                  {approvalLine.description || "-"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">
                  타입
                </label>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                    approvalLine.type === "COMMON"
                      ? "bg-primary/10 text-primary"
                      : "bg-secondary/10 text-secondary"
                  }`}
                >
                  {getTypeLabel(approvalLine.type)}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">
                  상태
                </label>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                    approvalLine.isActive
                      ? "bg-success/10 text-success"
                      : "bg-danger/10 text-danger"
                  }`}
                >
                  {approvalLine.isActive ? "활성" : "비활성"}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">
                  정렬 순서
                </label>
                <p className="text-sm text-primary">{approvalLine.order}</p>
              </div>
            </div>
          </div>

          {/* 결재 단계 정보 */}
          <div className="bg-surface/50 rounded-lg p-4">
            <h3 className="text-lg font-medium text-primary mb-4">
              결재 단계 ({approvalLine.formApprovalSteps.length}단계)
            </h3>
            <div className="space-y-4">
              {approvalLine.formApprovalSteps.map((step, index) => (
                <div
                  key={step.formApprovalStepId}
                  className="border border-border rounded-lg p-4"
                >
                  <h4 className="font-medium text-primary mb-3">
                    {index + 1}단계
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-secondary mb-1">
                        단계 ID
                      </label>
                      <p className="text-sm text-primary font-mono">
                        {step.formApprovalStepId}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-secondary mb-1">
                        단계 타입
                      </label>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full border ${getStepTypeColor(
                          step.type
                        )}`}
                      >
                        {getStepTypeLabel(step.type)}
                      </span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-secondary mb-1">
                        단계 순서
                      </label>
                      <p className="text-sm text-primary">{step.order}</p>
                    </div>
                  </div>

                  {/* 기본 결재자 정보 */}
                  <div>
                    <h5 className="font-medium text-primary mb-2">
                      기본 결재자
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-secondary mb-1">
                          결재자 ID
                        </label>
                        <p className="text-sm text-primary font-mono">
                          {step.defaultApprover.employeeId}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-secondary mb-1">
                          결재자명
                        </label>
                        <p className="text-sm text-primary font-medium">
                          {step.defaultApprover.name}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-secondary mb-1">
                          사번
                        </label>
                        <p className="text-sm text-primary">
                          {step.defaultApprover.employeeNumber}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-secondary mb-1">
                          부서
                        </label>
                        <p className="text-sm text-primary">
                          {step.defaultApprover.department}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-secondary mb-1">
                          직책
                        </label>
                        <p className="text-sm text-primary">
                          {step.defaultApprover.position}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-secondary mb-1">
                          직급
                        </label>
                        <p className="text-sm text-primary">
                          {step.defaultApprover.rank}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 생성/수정 정보 */}
          <div className="bg-surface/50 rounded-lg p-4">
            <h3 className="text-lg font-medium text-primary mb-4">
              생성/수정 정보
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">
                  생성일
                </label>
                <p className="text-sm text-primary">
                  {formatDate(approvalLine.createdAt)}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">
                  수정일
                </label>
                <p className="text-sm text-primary">
                  {formatDate(approvalLine.updatedAt)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 닫기 버튼 */}
        <div className="flex justify-end pt-6 border-t border-border mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
