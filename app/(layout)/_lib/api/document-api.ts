// 문서 관련 API 호출 함수

import { ApiClient } from "./api-client";

// 결재선 관련 타입 정의
export type ApprovalStepType =
  | "AGREEMENT"
  | "APPROVAL"
  | "IMPLEMENTATION"
  | "REFERENCE";

export interface FormApprovalStep {
  formApprovalStepId: string;
  type: ApprovalStepType;
  order: number;
  defaultApprover: {
    employeeId: string;
    name: string;
    employeeNumber: string;
    department: string;
    position: string;
    rank: string;
  };
}

export interface FormApprovalLine {
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

// 페이지네이션 메타데이터 타입
export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
}

// 페이지네이션 응답 타입
export interface PaginatedResponse<T> {
  items: T[];
  meta: PaginationMeta;
}

// 결재선 목록 조회 파라미터
export interface GetFormApprovalLinesParams {
  page?: number;
  limit?: number;
  type?: "COMMON" | "CUSTOM";
  search?: string;
}

export interface CreateFormApprovalLineRequest {
  name: string;
  description?: string;
  type: "COMMON" | "CUSTOM";
  formApprovalSteps: {
    type: ApprovalStepType;
    order: number;
    defaultApproverId?: string;
  }[];
}

export interface UpdateFormApprovalLineRequest {
  name?: string;
  description?: string;
  type?: "COMMON" | "CUSTOM";
  formApprovalSteps?: {
    type?: ApprovalStepType;
    order?: number;
    defaultApproverId?: string;
  }[];
  formApprovalLineId: string;
}

// 결재선 목록 조회 (페이지네이션 + 필터링 지원)
export const getFormApprovalLinesApi = async (
  params: GetFormApprovalLinesParams = {}
): Promise<PaginatedResponse<FormApprovalLine>> => {
  try {
    const { page = 1, limit = 10, type = "CUSTOM", search } = params;

    const queryParams: Record<string, string | number> = { page, limit };
    if (type) queryParams.type = type;
    if (search) queryParams.search = search;

    return ApiClient.get<PaginatedResponse<FormApprovalLine>>(
      "/api/document/approval-lines",
      queryParams
    );
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("결재선 목록 조회 중 오류가 발생했습니다.");
  }
};

// 결재선 상세 조회
export const getFormApprovalLineApi = async (
  id: string
): Promise<FormApprovalLine> => {
  try {
    return ApiClient.get<FormApprovalLine>(
      `/api/document/approval-lines/${id}`
    );
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("결재선 상세 조회 중 오류가 발생했습니다.");
  }
};

// 결재선 생성
export const createFormApprovalLineApi = async (
  requestData: CreateFormApprovalLineRequest
): Promise<FormApprovalLine> => {
  try {
    return ApiClient.post<FormApprovalLine>(
      "/api/document/approval-lines",
      requestData
    );
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("결재선 생성 중 오류가 발생했습니다.");
  }
};

// 결재선 수정
export const updateFormApprovalLineApi = async (
  id: string,
  requestData: UpdateFormApprovalLineRequest
): Promise<FormApprovalLine> => {
  try {
    return ApiClient.patch<FormApprovalLine>(
      `/api/document/approval-lines/${id}`,
      requestData
    );
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("결재선 수정 중 오류가 발생했습니다.");
  }
};

// 결재선 삭제
export const deleteFormApprovalLineApi = async (id: string): Promise<void> => {
  try {
    await ApiClient.delete(`/api/document/approval-lines/${id}`);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("결재선 삭제 중 오류가 발생했습니다.");
  }
};

// 문서양식 분류 관련 타입
export interface DocumentFormType {
  documentTypeId: string;
  name: string;
  documentNumberCode: string;
}

export interface CreateDocumentFormTypeRequest {
  name: string;
  documentNumberCode: string;
}

export interface UpdateDocumentFormTypeRequest {
  name?: string;
  documentNumberCode?: string;
  documentTypeId: string;
}

// 문서양식 분류 API 함수들
export const getDocumentFormTypes = async (): Promise<DocumentFormType[]> => {
  try {
    return ApiClient.get<DocumentFormType[]>("/api/document/form-types");
  } catch (error) {
    console.error("문서양식 분류 목록 조회 에러:", error);
    throw error;
  }
};

export const getDocumentFormType = async (
  id: string
): Promise<DocumentFormType> => {
  try {
    return ApiClient.get<DocumentFormType>(`/api/document/form-types/${id}`);
  } catch (error) {
    console.error("문서양식 분류 상세 조회 에러:", error);
    throw error;
  }
};

export const createDocumentFormType = async (
  data: CreateDocumentFormTypeRequest
): Promise<DocumentFormType> => {
  try {
    return ApiClient.post<DocumentFormType>("/api/document/form-types", data);
  } catch (error) {
    console.error("문서양식 분류 생성 에러:", error);
    throw error;
  }
};

export const updateDocumentFormType = async (
  id: string,
  data: UpdateDocumentFormTypeRequest
): Promise<DocumentFormType> => {
  try {
    return ApiClient.patch<DocumentFormType>(
      `/api/document/form-types/${id}`,
      data
    );
  } catch (error) {
    console.error("문서양식 분류 수정 에러:", error);
    throw error;
  }
};

export const deleteDocumentFormType = async (id: string): Promise<void> => {
  try {
    await ApiClient.delete<void>(`/api/document/form-types/${id}`);
  } catch (error) {
    console.error("문서양식 분류 삭제 에러:", error);
    throw error;
  }
};

// 문서양식 관련 타입
export interface DocumentForm {
  documentFormId: string;
  name: string;
  description: string;
  template: string;
  documentType: DocumentFormType;
  formApprovalLine?: FormApprovalLine;
  autoFillType: "NONE" | "DRAFTER_ONLY" | "DRAFTER_SUPERIOR";
}

export interface CreateDocumentFormRequest {
  name: string;
  description?: string;
  template: string;
  documentTypeId: string;
  formApprovalLineId?: string;
  autoFillType: "NONE" | "DRAFTER_ONLY" | "DRAFTER_SUPERIOR";
}

export interface UpdateDocumentFormRequest {
  name?: string;
  description?: string;
  template?: string;
  documentTypeId?: string;
  formApprovalLineId?: string;
  autoFillType?: "NONE" | "DRAFTER_ONLY" | "DRAFTER_SUPERIOR";
  documentFormId: string;
}

export interface GetDocumentFormsParams {
  page?: number;
  limit?: number;
  search?: string;
}

// 문서양식 API 함수들
export const getDocumentForms = async (
  params: GetDocumentFormsParams = {}
): Promise<PaginatedResponse<DocumentForm>> => {
  try {
    const queryParams: Record<string, string | number | boolean> = {};
    if (params.page) queryParams.page = params.page;
    if (params.limit) queryParams.limit = params.limit;
    if (params.search) queryParams.search = params.search;

    return ApiClient.get<PaginatedResponse<DocumentForm>>(
      "/api/document/forms",
      queryParams
    );
  } catch (error) {
    console.error("문서양식 목록 조회 에러:", error);
    throw error;
  }
};

export const getDocumentForm = async (id: string): Promise<DocumentForm> => {
  try {
    return ApiClient.get<DocumentForm>(`/api/document/forms/${id}`);
  } catch (error) {
    console.error("문서양식 상세 조회 에러:", error);
    throw error;
  }
};

export const createDocumentForm = async (
  data: CreateDocumentFormRequest
): Promise<DocumentForm> => {
  try {
    return ApiClient.post<DocumentForm>("/api/document/forms", data);
  } catch (error) {
    console.error("문서양식 생성 에러:", error);
    throw error;
  }
};

export const updateDocumentForm = async (
  id: string,
  data: UpdateDocumentFormRequest
): Promise<DocumentForm> => {
  try {
    return ApiClient.patch<DocumentForm>(`/api/document/forms/${id}`, data);
  } catch (error) {
    console.error("문서양식 수정 에러:", error);
    throw error;
  }
};

export const deleteDocumentForm = async (id: string): Promise<void> => {
  try {
    await ApiClient.delete<void>(`/api/document/forms/${id}`);
  } catch (error) {
    console.error("문서양식 삭제 에러:", error);
    throw error;
  }
};
