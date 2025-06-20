import { fetchApi } from "./api";
import type {
  ApprovalLine,
  CreateApprovalLineData,
  UpdateApprovalLineData,
  DocumentType,
  CreateDocumentTypeData,
  UpdateDocumentTypeData,
  DocumentForm,
  CreateDocumentFormData,
  UpdateDocumentFormData,
} from "../types/document";

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
  create: (data: CreateDocumentTypeData) =>
    fetchApi<DocumentType>("/document/form-types", "POST", data),

  getList: () => fetchApi<DocumentType[]>("/document/form-types"),

  getDetail: (id: string) =>
    fetchApi<DocumentType>(`/document/form-types/${id}`),

  update: (id: string, data: UpdateDocumentTypeData) =>
    fetchApi<DocumentType>(`/document/form-types/${id}`, "PATCH", data),

  delete: (id: string) =>
    fetchApi<null>(`/document/form-types/${id}`, "DELETE"),
};

// 문서 양식 API
export const documentFormApi = {
  create: (data: CreateDocumentFormData) =>
    fetchApi<DocumentForm>("/document/forms", "POST", data),

  getList: () => fetchApi<DocumentForm[]>("/document/forms"),

  getDetail: (id: string) => fetchApi<DocumentForm>(`/document/forms/${id}`),

  update: (id: string, data: UpdateDocumentFormData) =>
    fetchApi<DocumentForm>(`/document/forms/${id}`, "PATCH", data),

  delete: (id: string) => fetchApi<null>(`/document/forms/${id}`, "DELETE"),
};
