// 결재선 관련 타입들
export interface ApprovalLine {
  formApprovalLineId: string;
  name: string;
  description: string;
  type: "COMMON" | "CUSTOM";
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
  formApprovalSteps: FormApprovalStep[];
}

export interface FormApprovalStep {
  formApprovalStepId: string;
  type: string;
  order: number;
  defaultApprover: Employee;
}

export interface Employee {
  employeeId: string;
  name: string;
  employeeNumber: string;
  department: string;
  position: string;
  rank: string;
}

// 결재선 API 요청 데이터 타입들
export interface CreateApprovalLineData {
  name: string;
  description?: string;
  type: "COMMON" | "CUSTOM";
  formApprovalSteps: {
    type?: string;
    order?: number;
    defaultApproverId?: string;
    formApprovalStepId?: string;
  };
}

export interface UpdateApprovalLineData {
  name?: string;
  description?: string;
  type?: "COMMON" | "CUSTOM";
  formApprovalSteps?: {
    type?: string;
    order?: number;
    defaultApproverId?: string;
    formApprovalStepId?: string;
  };
  formApprovalLineId: string;
}

// 문서 타입 관련 타입들
export interface DocumentType {
  documentTypeId: string;
  name: string;
  documentNumberCode: string;
}

// 문서 타입 API 요청 데이터 타입들
export interface CreateDocumentTypeData {
  name: string;
  documentNumberCode: string;
}

export interface UpdateDocumentTypeData {
  name?: string;
  documentNumberCode?: string;
  documentTypeId: string;
}

// 문서 양식 관련 타입들
export interface DocumentForm {
  documentFormId: string;
  name: string;
  description?: string;
  template: string;
  receiverInfo: ReferencerInfo[];
  implementerInfo: ImplementerInfo[];
  documentType: DocumentType;
  formApprovalLine: ApprovalLine;
}

export interface ReferencerInfo {
  employeeId: string;
  name: string;
  rank: string;
}

export interface ImplementerInfo {
  employeeId: string;
  name: string;
  rank: string;
}

// 문서 양식 API 요청 데이터 타입들
export interface CreateDocumentFormData {
  name: string;
  description?: string;
  template: string;
  receiverInfo: ReferencerInfo[];
  implementerInfo: ImplementerInfo[];
  documentTypeId: string;
  formApprovalLineId: string;
}

export interface UpdateDocumentFormData {
  name?: string;
  description?: string;
  template?: string;
  receiverInfo?: ReferencerInfo[];
  implementerInfo?: ImplementerInfo[];
  documentTypeId?: string;
  formApprovalLineId?: string;
  documentFormId: string;
}
