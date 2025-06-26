import { ApiClient, ApiResponse } from "./api-client";

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

    const response = await ApiClient.get<
      ApiResponse<PaginationData<ApprovalResponseDto>>
    >("/api/approval/documents", queryParams);
    return response.data;
  },

  // 기안 문서 조회
  getDraft: async (id: string): Promise<ApprovalResponseDto> => {
    const response = await ApiClient.get<ApiResponse<ApprovalResponseDto>>(
      `/api/approval/documents/${id}`
    );
    return response.data;
  },

  // 기안 문서 수정
  updateDraft: async (
    id: string,
    data: UpdateDraftDocumentDto
  ): Promise<ApprovalResponseDto> => {
    const response = await ApiClient.patch<ApiResponse<ApprovalResponseDto>>(
      `/api/approval/documents/${id}`,
      data
    );
    return response.data;
  },

  // 기안 문서 삭제
  deleteDraft: async (id: string): Promise<void> => {
    const response = await ApiClient.delete<ApiResponse<void>>(
      `/api/approval/documents/${id}`
    );
    return response.data;
  },
};
