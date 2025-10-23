/**
 * API Client
 * LIAS 결재 시스템 API 통신을 위한 클라이언트
 */

import type {
  Document,
  ApprovalStep,
  TokenResponse,
  Department,
  DepartmentHierarchy,
  Position,
  EmployeeDetail,
  ApprovalLineTemplate,
  ApprovalLineTemplateVersion,
  Form,
  FormVersion,
} from "@/types/api";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3070";

interface RequestConfig extends RequestInit {
  token?: string;
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL + "/api";
  }

  private async request<T>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<T> {
    const { token, ...restConfig } = config;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const url = `${this.baseURL}${endpoint}`;
    console.log(`🌐 API 요청: ${config.method || "GET"} ${url}`);

    try {
      const response = await fetch(url, {
        ...restConfig,
        headers,
      });

      console.log(`📡 API 응답: ${response.status} ${response.statusText}`);

      if (!response.ok) {
        const error = await response.json().catch(() => ({
          message: `HTTP ${response.status}: ${response.statusText}`,
        }));
        console.error("❌ API 에러:", error);
        throw new Error(error.message || `HTTP ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      if (error instanceof Error && error.message.includes("fetch")) {
        console.error("❌ 네트워크 에러: 백엔드 서버에 연결할 수 없습니다.");
        throw new Error(
          "백엔드 서버에 연결할 수 없습니다. 서버가 실행 중인지 확인하세요."
        );
      }
      throw error;
    }
  }

  // Auth
  async generateToken(data: { employeeNumber?: string; email?: string }) {
    return this.request<TokenResponse>("/v2/test-data/token", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // Test Data API
  async createTestData(
    token: string,
    data: {
      scenario: string;
      documentCount?: number;
      titlePrefix?: string;
      progress?: number;
    }
  ) {
    return this.request<{
      success: boolean;
      message: string;
      data?: {
        forms: string[];
        formVersions: string[];
        documents: string[];
        approvalLineTemplates: string[];
        approvalLineTemplateVersions: string[];
        approvalStepTemplates: string[];
        approvalLineSnapshots: string[];
        approvalStepSnapshots: string[];
      };
    }>("/v2/test-data", {
      method: "POST",
      token,
      body: JSON.stringify(data),
    });
  }

  async deleteAllTestData(token: string) {
    return this.request<{
      success: boolean;
      message: string;
      data?: {
        deletedCount: number;
      };
    }>("/v2/test-data/all", {
      method: "DELETE",
      token,
    });
  }

  // Document API
  async createDocument(token: string, data: Record<string, unknown>) {
    return this.request<Document>("/v2/document", {
      method: "POST",
      token,
      body: JSON.stringify(data),
    });
  }

  async updateDocument(
    token: string,
    documentId: string,
    data: Record<string, unknown>
  ) {
    return this.request(`/v2/document/${documentId}`, {
      method: "PUT",
      token,
      body: JSON.stringify(data),
    });
  }

  async submitDocument(
    token: string,
    documentId: string,
    data: Record<string, unknown>
  ) {
    return this.request(`/v2/document/${documentId}/submit`, {
      method: "POST",
      token,
      body: JSON.stringify(data),
    });
  }

  async getDocumentApprovalSnapshot(token: string, documentId: string) {
    return this.request(`/v2/document/${documentId}/approval-snapshot`, {
      method: "GET",
      token,
    });
  }

  async deleteDocument(token: string, documentId: string) {
    return this.request(`/v2/document/${documentId}`, {
      method: "DELETE",
      token,
    });
  }

  async getDocument(token: string, documentId: string) {
    return this.request<Document>(`/v2/document/${documentId}`, {
      method: "GET",
      token,
    });
  }

  async getMyDocuments(token: string) {
    return this.request<Document[]>("/v2/document/my-documents", {
      method: "GET",
      token,
    });
  }

  async getDocumentsByStatus(token: string, status: string) {
    return this.request<Document[]>(`/v2/document/status/${status}`, {
      method: "GET",
      token,
    });
  }

  // Approval Process API
  async approveStep(
    token: string,
    data: { stepSnapshotId: string; comment?: string }
  ) {
    return this.request("/v2/approval-process/approve", {
      method: "POST",
      token,
      body: JSON.stringify(data),
    });
  }

  async rejectStep(
    token: string,
    data: { stepSnapshotId: string; comment: string }
  ) {
    return this.request("/v2/approval-process/reject", {
      method: "POST",
      token,
      body: JSON.stringify(data),
    });
  }

  async completeAgreement(
    token: string,
    data: { stepSnapshotId: string; comment?: string }
  ) {
    return this.request("/v2/approval-process/agreement/complete", {
      method: "POST",
      token,
      body: JSON.stringify(data),
    });
  }

  async completeImplementation(
    token: string,
    data: { stepSnapshotId: string; comment?: string; resultData?: unknown }
  ) {
    return this.request("/v2/approval-process/implementation/complete", {
      method: "POST",
      token,
      body: JSON.stringify(data),
    });
  }

  async cancelApproval(
    token: string,
    data: { documentId: string; reason: string }
  ) {
    return this.request("/v2/approval-process/cancel", {
      method: "POST",
      token,
      body: JSON.stringify(data),
    });
  }

  async getMyPendingApprovals(token: string) {
    return this.request<ApprovalStep[]>("/v2/approval-process/my-pending", {
      method: "GET",
      token,
    });
  }

  async getDocumentApprovalSteps(token: string, documentId: string) {
    const response = await this.request<{
      documentId: string;
      steps: ApprovalStep[];
      totalSteps: number;
      completedSteps: number;
    }>(`/v2/approval-process/document/${documentId}/steps`, {
      method: "GET",
      token,
    });
    return response.steps;
  }

  // Approval Flow API
  async cloneApprovalLineTemplate(
    token: string,
    data: Record<string, unknown>
  ) {
    return this.request("/v2/approval-flow/templates/clone", {
      method: "POST",
      token,
      body: JSON.stringify(data),
    });
  }

  async createApprovalLineTemplateVersion(
    token: string,
    templateId: string,
    data: Record<string, unknown>
  ) {
    return this.request(`/v2/approval-flow/templates/${templateId}/versions`, {
      method: "POST",
      token,
      body: JSON.stringify(data),
    });
  }

  // Metadata API
  async getMetadata(token: string) {
    return this.request("/metadata", {
      method: "GET",
      token,
    });
  }

  // Metadata API
  async getDepartments(token: string) {
    return this.request<Department[]>("/metadata/departments", {
      method: "GET",
      token,
    });
  }

  async getDepartmentHierarchyWithEmployees(
    token: string,
    activeOnly: boolean = true
  ) {
    return this.request<DepartmentHierarchy[]>(
      `/metadata/departments/hierarchy/with-employees?activeOnly=${activeOnly}`,
      {
        method: "GET",
        token,
      }
    );
  }

  async getDepartmentEmployees(token: string, departmentId: string) {
    return this.request<EmployeeDetail[]>(
      `/metadata/departments/${departmentId}/employees`,
      {
        method: "GET",
        token,
      }
    );
  }

  async getPositions(token: string) {
    return this.request<Position[]>("/metadata/positions", {
      method: "GET",
      token,
    });
  }

  async searchEmployees(
    token: string,
    params?: { search?: string; departmentId?: string }
  ) {
    const query = new URLSearchParams();
    if (params?.search) query.append("search", params.search);
    if (params?.departmentId) query.append("departmentId", params.departmentId);

    const queryString = query.toString();
    return this.request<EmployeeDetail[]>(
      `/metadata/employees${queryString ? `?${queryString}` : ""}`,
      {
        method: "GET",
        token,
      }
    );
  }

  async getEmployee(token: string, employeeId: string) {
    return this.request<EmployeeDetail>(`/metadata/employees/${employeeId}`, {
      method: "GET",
      token,
    });
  }

  async getApprovalLineTemplates(token: string, type?: string) {
    const query = type ? `?type=${type}` : "";
    return this.request<ApprovalLineTemplate[]>(
      `/v2/approval-flow/templates${query}`,
      {
        method: "GET",
        token,
      }
    );
  }

  async getApprovalLineTemplate(token: string, templateId: string) {
    return this.request<ApprovalLineTemplate>(
      `/v2/approval-flow/templates/${templateId}`,
      {
        method: "GET",
        token,
      }
    );
  }

  async getApprovalLineTemplateVersion(
    token: string,
    templateId: string,
    versionId: string
  ) {
    return this.request<ApprovalLineTemplateVersion>(
      `/v2/approval-flow/templates/${templateId}/versions/${versionId}`,
      {
        method: "GET",
        token,
      }
    );
  }

  async getForms(token: string) {
    return this.request<Form[]>("/v2/approval-flow/forms", {
      method: "GET",
      token,
    });
  }

  async getForm(token: string, formId: string) {
    return this.request<Form>(`/v2/approval-flow/forms/${formId}`, {
      method: "GET",
      token,
    });
  }

  async getFormVersion(token: string, formId: string, versionId: string) {
    return this.request<FormVersion>(
      `/v2/approval-flow/forms/${formId}/versions/${versionId}`,
      {
        method: "GET",
        token,
      }
    );
  }

  async previewApprovalLine(
    token: string,
    formId: string,
    data: {
      formVersionId: string;
      drafterDepartmentId?: string;
      documentAmount?: number;
      documentType?: string;
    }
  ) {
    return this.request<{
      templateName: string;
      templateDescription?: string;
      steps: Array<{
        stepOrder: number;
        stepType: string;
        isRequired: boolean;
        employeeId: string;
        employeeName: string;
        departmentName?: string;
        positionTitle?: string;
        assigneeRule: string;
      }>;
    }>(`/v2/approval-flow/forms/${formId}/preview-approval-line`, {
      method: "POST",
      token,
      body: JSON.stringify(data),
    });
  }

  // Form & Approval Line Management
  async createFormWithApprovalLine(
    token: string,
    data: {
      formName: string;
      formCode: string;
      description?: string;
      template?: string;
      useExistingLine?: boolean;
      lineTemplateVersionId?: string;
      baseLineTemplateVersionId?: string;
      stepEdits?: Record<string, unknown>[];
    }
  ) {
    return this.request("/v2/approval-flow/forms", {
      method: "POST",
      token,
      body: JSON.stringify(data),
    });
  }

  async updateFormVersion(
    token: string,
    formId: string,
    data: {
      versionNote?: string;
      template?: string;
      lineTemplateVersionId?: string;
      cloneAndEdit?: boolean;
      baseLineTemplateVersionId?: string;
      stepEdits?: Array<{
        stepOrder: number;
        stepType: string;
        assigneeRule: string;
        targetDepartmentId?: string;
        targetPositionId?: string;
        targetEmployeeId?: string;
        isRequired: boolean;
      }>;
    }
  ) {
    return this.request(`/v2/approval-flow/forms/${formId}/versions`, {
      method: "PATCH",
      token,
      body: JSON.stringify({ ...data, formId }),
    });
  }

  async createApprovalLineTemplate(
    token: string,
    data: {
      name: string;
      description?: string;
      type: string;
      orgScope: string;
      departmentId?: string;
      steps: Array<{
        stepOrder: number;
        stepType: string;
        assigneeRule: string;
        targetDepartmentId?: string;
        targetPositionId?: string;
        targetEmployeeId?: string;
        isRequired: boolean;
      }>;
    }
  ) {
    return this.request("/v2/approval-flow/templates", {
      method: "POST",
      token,
      body: JSON.stringify(data),
    });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
