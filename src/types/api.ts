/**
 * API Response Types
 */

export interface Document {
  id: string;
  formId: string;
  formVersionId: string;
  title: string;
  content: string;
  status: string;
  drafterId: string;
  approvalLineSnapshotId?: string;
  documentNumber?: string;
  submittedAt?: string;
  completedAt?: string;
  cancelReason?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface ApprovalStep {
  id: string;
  snapshotId: string;
  stepOrder: number;
  stepType: string;
  assigneeRule: string;
  approverId?: string;
  approverName?: string;
  approverDepartmentName?: string;
  approverPositionTitle?: string;
  status: string;
  processedAt?: string;
  approvedAt?: string;
  rejectedAt?: string;
  completedAt?: string;
  comment?: string;
  isRequired?: boolean;
  description?: string;
  createdAt: string;
  updatedAt: string;
  // 문서 정보
  documentId?: string;
  documentTitle?: string;
  documentNumber?: string;
  drafterId?: string;
  drafterName?: string;
  drafterDepartmentName?: string;
  documentStatus?: string;
  submittedAt?: string;
}

export interface Employee {
  id: string;
  employeeNumber: string;
  name: string;
  email: string;
}

export interface TokenResponse {
  success: boolean;
  message: string;
  accessToken: string;
  expiresIn: number;
  employee: Employee;
}

// Metadata Types
export interface Department {
  id: string;
  departmentCode: string;
  departmentName: string;
  parentDepartmentId?: string;
  type: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface DepartmentEmployee {
  id: string;
  employeeNumber: string;
  name: string;
  email?: string;
  phoneNumber?: string;
  status: string;
  departmentId: string;
  positionTitle?: string;
  positionLevel?: number;
}

export interface DepartmentHierarchy {
  id: string;
  departmentCode: string;
  departmentName: string;
  type: string;
  order: number;
  parentDepartmentId?: string;
  employees: DepartmentEmployee[];
  children: DepartmentHierarchy[];
}

export interface Position {
  id: string;
  positionCode: string;
  positionTitle: string;
  level: number;
  hasManagementAuthority: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface EmployeeDetail extends Employee {
  departments?: {
    department: Department;
    position: Position;
  }[];
}

export interface ApprovalLineTemplate {
  id: string;
  name: string;
  description?: string;
  type: string;
  orgScope: string;
  status: string;
  currentVersionId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApprovalLineTemplateVersion {
  id: string;
  templateId: string;
  versionNo: number;
  isActive: boolean;
  changeReason?: string;
  steps?: ApprovalStepTemplate[];
  createdAt: string;
  updatedAt: string;
}

export interface ApprovalStepTemplate {
  id: string;
  lineTemplateVersionId: string;
  stepOrder: number;
  stepType: string;
  assigneeRule: string;
  defaultApproverId?: string;
  targetDepartmentId?: string;
  targetPositionId?: string;
  required: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Form {
  id: string;
  name: string;
  code: string;
  description?: string;
  status: string;
  currentVersionId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FormVersion {
  id: string;
  formId: string;
  versionNo: number;
  template: string;
  isActive: boolean;
  changeReason?: string;
  createdAt: string;
  updatedAt: string;
  approvalLineInfo?: {
    template: ApprovalLineTemplate;
    templateVersion: ApprovalLineTemplateVersion;
    steps: ApprovalStepTemplate[];
  };
}
