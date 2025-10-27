/**
 * Document API 타입 정의
 * DOCUMENT-API.md 참조
 */

/**
 * 문서 상태
 */
export type DocumentStatus =
  | "DRAFT"
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "CANCELLED"
  | "IMPLEMENTED";

/**
 * 문서 생성 요청
 * POST /api/v2/document
 */
export interface CreateDocumentRequest {
  formVersionId: string;
  title: string;
  content: string;
  metadata?: Record<string, unknown>;
}

/**
 * 문서 수정 요청
 * PUT /api/v2/document/:documentId
 */
export interface UpdateDocumentRequest {
  title?: string;
  content?: string;
  metadata?: Record<string, unknown>;
}

/**
 * 문서 정보
 */
export interface Document {
  id: string;
  formId: string;
  formVersionId: string;
  drafterId: string;
  drafterName?: string;
  drafterDepartmentId?: string;
  drafterDepartmentName?: string;
  title: string;
  content?: string;
  status: DocumentStatus;
  metadata?: Record<string, unknown>;
  documentNumber?: string;
  approvalLineSnapshotId?: string;
  submittedAt?: Date;
  cancelReason?: string;
  cancelledAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 문서 제출 - 기안 컨텍스트
 * POST /api/v2/document/:documentId/submit
 */
export interface DraftContext {
  drafterDepartmentId?: string;
  documentAmount?: number;
  documentType?: string;
}

/**
 * 문서 제출 - 커스텀 결재 단계
 */
export interface CustomApprovalStep {
  stepOrder: number;
  stepType: string;
  isRequired: boolean;
  employeeId?: string;
  departmentId?: string;
  assigneeRule: string;
}

/**
 * 문서 제출 요청
 */
export interface SubmitDocumentRequest {
  draftContext?: DraftContext;
  customApprovalSteps?: CustomApprovalStep[];
}

/**
 * 문서 삭제 응답
 * DELETE /api/v2/document/:documentId
 */
export interface DeleteDocumentResponse {
  message: string;
  documentId: string;
}
