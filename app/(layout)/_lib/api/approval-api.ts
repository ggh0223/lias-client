import { ApiClient } from "./api-client";

export interface CreateDraftDocumentDto {
  documentNumber: string;
  documentType: string;
  title: string;
  content: string;
  drafterId: string;
  approvalSteps: CreateApprovalStepDto[];
  parentDocumentId?: string;
  files: FileDto[];
}

export interface CreateApprovalStepDto {
  type: string;
  order: number;
  approverId: string;
}

export interface FileDto {
  fileId: string;
  fileName: string;
  filePath: string;
  createdAt: string;
}

export interface EmployeeResponseDto {
  employeeId: string;
  name: string;
  employeeNumber: string;
  email: string;
  department: string;
  position: string;
  rank: string;
}

export interface ApprovalStepResponseDto {
  type: string;
  order: number;
  approvedDate: string;
  isApproved: boolean;
  isCurrent: boolean;
  createdAt: string;
  updatedAt: string;
  approver: EmployeeResponseDto;
}

export interface ApprovalResponseDto {
  documentId: string;
  documentNumber: string;
  documentType: string;
  title: string;
  content: string;
  status: string;
  retentionPeriod: string;
  retentionPeriodUnit: string;
  retentionStartDate: string;
  retentionEndDate: string;
  implementDate: string;
  createdAt: string;
  updatedAt: string;
  drafter: EmployeeResponseDto;
  approvalSteps: ApprovalStepResponseDto[];
  currentStep?: ApprovalStepResponseDto;
  parentDocument: ApprovalResponseDto | null;
  files: FileDto[];
}

export interface UpdateDraftDocumentDto extends CreateDraftDocumentDto {
  id: string;
}

export interface PaginationQueryDto {
  page?: number;
  limit?: number;
  status?: string[];
}

export interface ApprovalDocumentsQueryDto {
  page?: number;
  limit?: number;
  listType:
    | "drafted"
    | "pending_approval"
    | "pending_agreement"
    | "approved"
    | "rejected"
    | "received_reference"
    | "implementation";
}

export interface PaginationData<T> {
  items: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    hasNext: boolean;
  };
}

export const approvalApi = {
  // 기안 문서 생성
  createDraft: async (
    data: CreateDraftDocumentDto
  ): Promise<ApprovalResponseDto> => {
    return ApiClient.post<ApprovalResponseDto>("/api/approval/documents", data);
  },

  // 기안 문서 목록 조회
  getDraftList: async (
    params?: PaginationQueryDto
  ): Promise<PaginationData<ApprovalResponseDto>> => {
    const queryParams: Record<string, string | number | boolean> = {};
    if (params?.page) queryParams.page = params.page;
    if (params?.limit) queryParams.limit = params.limit;
    if (params?.status) queryParams.status = params.status.join(",");

    return ApiClient.get<PaginationData<ApprovalResponseDto>>(
      "/api/approval/documents",
      queryParams
    );
  },

  // 결재 문서 조회 (documentListType별)
  getApprovalDocuments: async (
    params: ApprovalDocumentsQueryDto
  ): Promise<PaginationData<ApprovalResponseDto>> => {
    const queryParams: Record<string, string | number | boolean> = {
      listType: params.listType,
    };
    if (params.page) queryParams.page = params.page;
    if (params.limit) queryParams.limit = params.limit;

    return ApiClient.get<PaginationData<ApprovalResponseDto>>(
      "/api/approval/documents",
      queryParams
    );
  },

  // 기안 문서 조회
  getDraft: async (id: string): Promise<ApprovalResponseDto> => {
    return ApiClient.get<ApprovalResponseDto>(`/api/approval/documents/${id}`);
  },

  // 기안 문서 수정
  updateDraft: async (
    id: string,
    data: UpdateDraftDocumentDto
  ): Promise<ApprovalResponseDto> => {
    return ApiClient.patch<ApprovalResponseDto>(
      `/api/approval/documents/${id}`,
      data
    );
  },

  // 기안 문서 삭제
  deleteDraft: async (id: string): Promise<void> => {
    return ApiClient.delete<void>(`/api/approval/documents/${id}`);
  },

  // 결재 승인
  approveDocument: async (documentId: string): Promise<void> => {
    return ApiClient.post<void>(`/api/approval/${documentId}/approve`);
  },

  // 결재 반려
  rejectDocument: async (documentId: string): Promise<void> => {
    return ApiClient.post<void>(`/api/approval/${documentId}/reject`);
  },

  // 시행
  implementDocument: async (documentId: string): Promise<void> => {
    return ApiClient.post<void>(`/api/approval/${documentId}/implementation`);
  },

  // 열람
  referenceDocument: async (documentId: string): Promise<void> => {
    return ApiClient.post<void>(`/api/approval/${documentId}/reference`);
  },
};
