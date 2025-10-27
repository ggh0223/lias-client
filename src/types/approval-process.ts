/**
 * Approval Process API 타입 정의
 * APPROVAL-PROCESS-API.md 참조
 */

/**
 * 결재 단계 스냅샷 상태
 */
export type StepSnapshotStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "CANCELLED";

/**
 * 결재 승인 요청
 * POST /api/v2/approval-process/approve
 */
export interface ApproveRequest {
  stepSnapshotId: string;
  comment?: string;
}

/**
 * 결재 반려 요청
 * POST /api/v2/approval-process/reject
 */
export interface RejectRequest {
  stepSnapshotId: string;
  comment: string; // 필수
}

/**
 * 협의 완료 요청
 * POST /api/v2/approval-process/agreement/complete
 */
export interface CompleteAgreementRequest {
  stepSnapshotId: string;
  comment?: string;
}

/**
 * 시행 완료 요청
 * POST /api/v2/approval-process/implementation/complete
 */
export interface CompleteImplementationRequest {
  stepSnapshotId: string;
  comment?: string;
  resultData?: Record<string, unknown>;
}

/**
 * 결재 취소 요청
 * POST /api/v2/approval-process/cancel
 */
export interface CancelApprovalRequest {
  documentId: string;
  reason: string;
}

/**
 * 결재 단계 스냅샷 정보
 */
export interface StepSnapshot {
  id: string;
  snapshotId: string;
  stepOrder: number;
  stepType: "AGREEMENT" | "APPROVAL" | "IMPLEMENTATION" | "REFERENCE";
  approverId: string;
  approverName?: string;
  approverDepartmentId?: string;
  approverDepartmentName?: string;
  approverPositionId?: string;
  approverPositionTitle?: string;
  assigneeRule?: string;
  status: StepSnapshotStatus;
  comment?: string;
  approvedAt?: Date;
  isRequired?: boolean;
  description?: string;
  createdAt: Date;
  documentId?: string;
  documentTitle?: string;
  documentNumber?: string;
  drafterId?: string;
  drafterName?: string;
  drafterDepartmentName?: string;
  documentStatus?: string;
  submittedAt?: Date;
}

/**
 * 결재 취소 응답
 */
export interface CancelApprovalResponse {
  message: string;
  documentId: string;
  documentStatus: string;
}

/**
 * 문서의 결재 단계 조회 응답
 * GET /api/v2/approval-process/document/:documentId/steps
 */
export interface DocumentStepsResponse {
  documentId: string;
  steps: StepSnapshot[];
  totalSteps: number;
  completedSteps: number;
}
