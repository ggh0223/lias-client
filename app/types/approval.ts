export type ApproverType =
  | "USER"
  | "DEPARTMENT_POSITION"
  | "POSITION"
  | "TITLE";
export type DepartmentScopeType = "SELECTED" | "DRAFT_OWNER";
export type ApprovalStepType =
  | "APPROVAL"
  | "AGREEMENT"
  | "EXECUTION"
  | "REFERENCE";
export type ApprovalStatus = "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";
export type ApprovalLineType = "COMMON" | "CUSTOM";

export interface ApprovalStep {
  type: ApprovalStepType;
  order: number;
  approverType: ApproverType;
  approverValue: string;
  departmentScopeType?: DepartmentScopeType;
  conditionExpression?: object;
  isMandatory: boolean;
  defaultApproverId?: string;
}

export interface ApprovalLine {
  formApprovalLineId: string;
  name: string;
  description?: string;
  type: ApprovalLineType;
  isActive: boolean;
  order: number;
  formApprovalSteps: ApprovalStep[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateApprovalLineData {
  name: string;
  description?: string;
  type: ApprovalLineType;
  formApprovalSteps: ApprovalStep[];
}

export interface UpdateApprovalLineData {
  name?: string;
  description?: string;
  type?: ApprovalLineType;
  formApprovalSteps?: ApprovalStep[];
}
