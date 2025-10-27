/**
 * Approval Flow Types
 * API 문서: docs/APPROVAL-FLOW-API.md
 */

/**
 * 결재 단계 유형
 */
export type StepType =
  | "AGREEMENT"
  | "APPROVAL"
  | "IMPLEMENTATION"
  | "REFERENCE";

/**
 * 담당자 지정 규칙
 */
export type AssigneeRule =
  | "FIXED"
  | "DRAFTER"
  | "DRAFTER_SUPERIOR"
  | "DEPARTMENT_REFERENCE";

/**
 * 결재선 유형
 * - COMMON: 공통
 * - CUSTOM: 커스텀 (커스텀)
 */
export type ApprovalLineType = "COMMON" | "CUSTOM";

/**
 * 조직 범위
 * - ALL: 전사 공통
 * - SPECIFIC_DEPARTMENT: 특정 부서 전용
 */
export type OrgScope = "ALL" | "SPECIFIC_DEPARTMENT";

/**
 * 결재 단계 템플릿
 */
export interface ApprovalStepTemplate {
  id?: string;
  lineTemplateVersionId?: string;
  stepOrder: number;
  stepType: StepType;
  assigneeRule: AssigneeRule;
  targetDepartmentId?: string;
  targetPositionId?: string;
  targetEmployeeId?: string;
  defaultApproverId?: string;
  isRequired: boolean;
  required?: boolean;
  description?: string;
  defaultApprover?: {
    id: string;
    employeeNumber: string;
    name: string;
    email: string;
    phoneNumber?: string;
  };
  targetDepartment?: {
    id: string;
    departmentCode: string;
    departmentName: string;
  };
  targetPosition?: {
    id: string;
    positionCode: string;
    positionTitle: string;
    level: number;
    hasManagementAuthority: boolean;
  };
}

/**
 * 문서양식 생성 요청
 */
export interface CreateFormRequest {
  formName: string;
  formCode: string;
  description?: string;
  template?: string;
  useExistingLine?: boolean;
  lineTemplateVersionId?: string;
  baseLineTemplateVersionId?: string;
  stepEdits?: ApprovalStepTemplate[];
}

/**
 * 결재선 템플릿 생성 요청
 */
export interface CreateTemplateRequest {
  name: string;
  description?: string;
  type: ApprovalLineType;
  orgScope: OrgScope;
  departmentId?: string;
  steps: ApprovalStepTemplate[];
}

/**
 * 결재선 템플릿 복제 요청
 */
export interface CloneTemplateRequest {
  baseTemplateVersionId: string;
  newTemplateName?: string;
  stepEdits?: ApprovalStepTemplate[];
}

/**
 * 결재 스냅샷 생성 요청
 */
export interface CreateSnapshotRequest {
  documentId: string;
  formVersionId: string;
  draftContext: {
    drafterId: string;
    drafterDepartmentId?: string;
    documentAmount?: number;
    documentType?: string;
    customFields?: Record<string, unknown>;
  };
}

/**
 * 결재선 미리보기 요청
 */
export interface PreviewApprovalLineRequest {
  formVersionId: string;
  drafterDepartmentId?: string;
  documentAmount?: number;
  documentType?: string;
}

/**
 * 결재선 미리보기 응답 단계 정보
 */
export interface PreviewStepInfo {
  stepOrder: number;
  stepType: StepType;
  employeeId?: string;
  employeeName: string;
  departmentName?: string;
  positionTitle?: string;
  isRequired: boolean;
  assigneeRule?: AssigneeRule;
  // Legacy field names (for compatibility)
  approverId?: string;
  approverName?: string;
  approverDepartmentName?: string;
  approverPositionTitle?: string;
}

/**
 * 결재선 미리보기 응답
 */
export interface PreviewApprovalLineResponse {
  templateName: string;
  templateDescription?: string;
  steps: PreviewStepInfo[];
}

/**
 * 결재선 템플릿
 */
export interface ApprovalLineTemplate {
  id: string;
  name: string;
  description?: string;
  type: ApprovalLineType;
  orgScope: OrgScope;
  departmentId?: string;
  status: string;
  currentVersionId?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 결재선 템플릿 버전
 */
export interface TemplateVersion {
  id: string;
  templateId: string;
  versionNo: number;
  isActive: boolean;
  changeReason?: string;
  createdAt: Date;
}

/**
 * 결재선 템플릿 버전 상세 정보
 */
export interface TemplateVersionDetail extends TemplateVersion {
  steps: ApprovalStepTemplate[];
}

/**
 * 결재선 템플릿 버전 생성 요청
 */
export interface CreateTemplateVersionRequest {
  templateId?: string;
  versionNote?: string;
  steps: ApprovalStepTemplate[];
}

/**
 * 문서양식
 */
export interface Form {
  id: string;
  name: string;
  code: string;
  description?: string;
  status: string;
  currentVersionId?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 문서양식 버전
 */
export interface FormVersion {
  id: string;
  formId: string;
  versionNo: number;
  isActive: boolean;
  changeReason?: string;
  template?: string;
  createdAt: Date;
  updatedAt?: Date;
}

/**
 * 문서양식 버전 상세 정보
 */
export interface FormVersionDetail extends FormVersion {
  approvalLineInfo?: {
    template?: {
      id: string;
      name: string;
      type: string;
      orgScope: string;
    };
    templateVersion?: {
      id: string;
      templateId: string;
      versionNo: number;
      isActive: boolean;
      changeReason?: string;
      createdAt: Date;
    };
    steps?: ApprovalStepTemplate[];
  };
}

/**
 * 문서양식 수정 요청
 */
export interface UpdateFormVersionRequest {
  versionNote?: string;
  template?: string;
  cloneAndEdit?: boolean;
  baseLineTemplateVersionId?: string;
  stepEdits?: ApprovalStepTemplate[];
}
