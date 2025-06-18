import { fetchApi } from "./api";
import type {
  ApprovalLine,
  CreateApprovalLineData,
  UpdateApprovalLineData,
} from "../types/approval";

// 문서 양식 분류 관련 타입
interface DocumentType {
  documentTypeId: string;
  name: string;
  documentNumberCode: string;
}

// 문서 양식 관련 타입
interface DocumentForm {
  documentFormId: string;
  name: string;
  description?: string;
  template: string;
  documentType: DocumentType;
  formApprovalLine: ApprovalLine;
}

// 결재선 API
export const approvalLineApi = {
  create: (data: CreateApprovalLineData) =>
    fetchApi<ApprovalLine>("/document/approval-lines", "POST", data),

  getList: () => fetchApi<ApprovalLine[]>("/document/approval-lines"),

  getDetail: (id: string) =>
    fetchApi<ApprovalLine>(`/document/approval-lines/${id}`),

  update: (id: string, data: UpdateApprovalLineData) =>
    fetchApi<ApprovalLine>(`/document/approval-lines/${id}`, "PATCH", data),

  delete: (id: string) =>
    fetchApi<null>(`/document/approval-lines/${id}`, "DELETE"),
};

// 문서 양식 분류 API
export const documentTypeApi = {
  create: (data: { name: string; documentNumberCode: string }) =>
    fetchApi<DocumentType>("/document/form-types", "POST", data),

  getList: () => fetchApi<DocumentType[]>("/document/form-types"),

  getDetail: (id: string) =>
    fetchApi<DocumentType>(`/document/form-types/${id}`),

  update: (
    id: string,
    data: Partial<{ name: string; documentNumberCode: string }>
  ) => fetchApi<DocumentType>(`/document/form-types/${id}`, "PATCH", data),

  delete: (id: string) =>
    fetchApi<null>(`/document/form-types/${id}`, "DELETE"),
};

// 문서 양식 API
export const documentFormApi = {
  create: (data: {
    name: string;
    description?: string;
    template: string;
    documentTypeId: string;
    formApprovalLineId: string;
  }) => fetchApi<DocumentForm>("/document/forms", "POST", data),

  getList: () => fetchApi<DocumentForm[]>("/document/forms"),

  getDetail: (id: string) => fetchApi<DocumentForm>(`/document/forms/${id}`),

  update: (
    id: string,
    data: Partial<{
      name: string;
      description: string;
      template: string;
      documentTypeId: string;
      formApprovalLineId: string;
    }>
  ) => fetchApi<DocumentForm>(`/document/forms/${id}`, "PATCH", data),

  delete: (id: string) => fetchApi<null>(`/document/forms/${id}`, "DELETE"),
};
