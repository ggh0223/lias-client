/**
 * API Server
 * Next.js Server-Side에서 Backend API를 호출하는 클라이언트
 * AGENTS.md: API Route Handler에서 사용
 */

import type {
  ApprovalLineTemplate,
  TemplateVersion,
  TemplateVersionDetail,
  CreateTemplateRequest,
  CloneTemplateRequest,
  CreateTemplateVersionRequest,
  Form,
  FormVersion,
  CreateFormRequest,
  UpdateFormVersionRequest,
  PreviewApprovalLineRequest,
  PreviewApprovalLineResponse,
} from "@/types/approval-flow";
import type {
  Document,
  CreateDocumentRequest,
  UpdateDocumentRequest,
  SubmitDocumentRequest,
} from "@/types/document";
import type {
  StepSnapshot,
  ApproveRequest,
  RejectRequest,
  CompleteAgreementRequest,
  CompleteImplementationRequest,
  CancelApprovalRequest,
  DocumentStepsResponse,
} from "@/types/approval-process";
import type {
  Department,
  DepartmentWithEmployees,
  Employee,
} from "@/types/metadata";

const BACKEND_API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3070";

class ApiServer {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    token: string,
    config: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    const response = await fetch(url, {
      ...config,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...config.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: `HTTP ${response.status}: ${response.statusText}`,
      }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // 토큰 없이 호출하는 메서드
  private async requestWithoutAuth<T>(
    endpoint: string,
    config: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    const response = await fetch(url, {
      ...config,
      headers: {
        "Content-Type": "application/json",
        ...config.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: `HTTP ${response.status}: ${response.statusText}`,
      }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // ============================================
  // Approval Flow API
  // Base URL: /api/approval-flow
  // ============================================

  /**
   * 1. 결재선 템플릿 목록 조회
   * GET /api/approval-flow/templates
   */
  async getApprovalLineTemplates(token: string, type?: string) {
    const query = type ? `?type=${type}` : "";
    return this.request<ApprovalLineTemplate[]>(
      `/api/approval-flow/templates${query}`,
      token,
      { method: "GET" }
    );
  }

  /**
   * 2. 결재선 템플릿 상세 조회
   * GET /api/approval-flow/templates/:templateId
   */
  async getApprovalLineTemplate(token: string, templateId: string) {
    return this.request<ApprovalLineTemplate>(
      `/api/approval-flow/templates/${templateId}`,
      token,
      { method: "GET" }
    );
  }

  /**
   * 3. 결재선 템플릿 버전 상세 조회
   * GET /api/approval-flow/templates/:templateId/versions/:versionId
   */
  async getApprovalLineTemplateVersion(
    token: string,
    templateId: string,
    versionId: string
  ) {
    return this.request<TemplateVersionDetail>(
      `/api/approval-flow/templates/${templateId}/versions/${versionId}`,
      token,
      { method: "GET" }
    );
  }

  /**
   * 4. 결재선 템플릿 생성
   * POST /api/approval-flow/templates
   */
  async createApprovalLineTemplate(token: string, data: CreateTemplateRequest) {
    return this.request<ApprovalLineTemplate>(
      `/api/approval-flow/templates`,
      token,
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );
  }

  /**
   * 5. 결재선 템플릿 복제
   * POST /api/approval-flow/templates/clone
   */
  async cloneApprovalLineTemplate(token: string, data: CloneTemplateRequest) {
    return this.request<TemplateVersion>(
      `/api/approval-flow/templates/clone`,
      token,
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );
  }

  /**
   * 6. 결재선 템플릿 새 버전 생성
   * POST /api/approval-flow/templates/:templateId/versions
   */
  async createApprovalLineTemplateVersion(
    token: string,
    templateId: string,
    data: CreateTemplateVersionRequest
  ) {
    return this.request<TemplateVersion>(
      `/api/approval-flow/templates/${templateId}/versions`,
      token,
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );
  }

  /**
   * 7. 문서템플릿 목록 조회
   * GET /api/approval-flow/forms
   */
  async getForms(token: string) {
    return this.request<Form[]>(`/api/approval-flow/forms`, token, {
      method: "GET",
    });
  }

  /**
   * 8. 문서템플릿 상세 조회
   * GET /api/approval-flow/forms/:formId
   */
  async getFormById(token: string, formId: string) {
    return this.request<Form>(`/api/approval-flow/forms/${formId}`, token, {
      method: "GET",
    });
  }

  /**
   * 9. 문서템플릿 버전 상세 조회
   * GET /api/approval-flow/forms/:formId/versions/:versionId
   */
  async getFormVersion(token: string, formId: string, versionId: string) {
    return this.request<FormVersion>(
      `/api/approval-flow/forms/${formId}/versions/${versionId}`,
      token,
      { method: "GET" }
    );
  }

  /**
   * 10. 문서템플릿 생성
   * POST /api/approval-flow/forms
   */
  async createForm(token: string, data: CreateFormRequest) {
    return this.request<Form>(`/api/approval-flow/forms`, token, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  /**
   * 11. 문서템플릿 버전 수정
   * PATCH /api/approval-flow/forms/:formId/versions
   */
  async updateFormVersion(
    token: string,
    formId: string,
    data: UpdateFormVersionRequest
  ) {
    return this.request<FormVersion>(
      `/api/approval-flow/forms/${formId}/versions`,
      token,
      {
        method: "PATCH",
        body: JSON.stringify(data),
      }
    );
  }

  /**
   * 12. 결재선 미리보기
   * POST /api/approval-flow/forms/:formId/preview-approval-line
   */
  async previewApprovalLine(
    token: string,
    formId: string,
    data: PreviewApprovalLineRequest
  ) {
    return this.request<PreviewApprovalLineResponse>(
      `/api/approval-flow/forms/${formId}/preview-approval-line`,
      token,
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );
  }

  /**
   * 13. 결재 스냅샷 생성
   * POST /api/approval-flow/snapshots
   */
  async createApprovalSnapshot(
    token: string,
    data: {
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
  ) {
    return this.request<{
      id: string;
      documentId: string;
      frozenAt: string;
      steps: Array<{
        id: string;
        stepOrder: number;
        stepType: string;
        approverId: string;
        approverDepartmentId?: string;
        required: boolean;
        status: string;
      }>;
    }>(`/api/approval-flow/snapshots`, token, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // ============================================
  // Document API (v2)
  // Base URL: /api/document
  // ============================================

  /**
   * 1. 문서 생성
   * POST /api/document
   */
  async createDocument(token: string, data: CreateDocumentRequest) {
    return this.request<Document>(`/api/document`, token, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  /**
   * 2. 문서 수정
   * PUT /api/document/:documentId
   */
  async updateDocument(
    token: string,
    documentId: string,
    data: UpdateDocumentRequest
  ) {
    return this.request<Document>(`/api/document/${documentId}`, token, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  /**
   * 3. 문서 제출
   * POST /api/document/:documentId/submit
   */
  async submitDocument(
    token: string,
    documentId: string,
    data: SubmitDocumentRequest
  ) {
    return this.request<Document>(`/api/document/${documentId}/submit`, token, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  /**
   * 4. 문서 삭제
   * DELETE /api/document/:documentId
   */
  async deleteDocument(token: string, documentId: string) {
    return this.request<{ message: string; documentId: string }>(
      `/api/document/${documentId}`,
      token,
      { method: "DELETE" }
    );
  }

  /**
   * 5. 문서 조회
   * GET /api/document/:documentId
   */
  async getDocumentById(token: string, documentId: string) {
    return this.request<Document>(`/api/document/${documentId}`, token, {
      method: "GET",
    });
  }

  /**
   * 6. 내 문서 조회
   * GET /api/document/my-documents
   */
  async getMyDocuments(token: string) {
    return this.request<Document[]>(`/api/document/my-documents`, token, {
      method: "GET",
    });
  }

  /**
   * 7. 상태별 문서 조회
   * GET /api/document/status/:status
   */
  async getDocumentsByStatus(token: string, status: string) {
    return this.request<Document[]>(`/api/document/status/${status}`, token, {
      method: "GET",
    });
  }

  // ============================================
  // Approval Process API (v2)
  // Base URL: /api/approval-process
  // ============================================

  /**
   * 1. 결재 승인
   * POST /api/approval-process/approve
   */
  async approveStep(token: string, data: ApproveRequest) {
    return this.request<StepSnapshot>(`/api/approval-process/approve`, token, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  /**
   * 2. 결재 반려
   * POST /api/approval-process/reject
   */
  async rejectStep(token: string, data: RejectRequest) {
    return this.request<StepSnapshot>(`/api/approval-process/reject`, token, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  /**
   * 3. 협의 완료
   * POST /api/approval-process/agreement/complete
   */
  async completeAgreement(token: string, data: CompleteAgreementRequest) {
    return this.request<StepSnapshot>(
      `/api/approval-process/agreement/complete`,
      token,
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );
  }

  /**
   * 4. 시행 완료
   * POST /api/approval-process/implementation/complete
   */
  async completeImplementation(
    token: string,
    data: CompleteImplementationRequest
  ) {
    return this.request<StepSnapshot>(
      `/api/approval-process/implementation/complete`,
      token,
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );
  }

  /**
   * 5. 결재 취소
   * POST /api/approval-process/cancel
   */
  async cancelDocument(token: string, data: CancelApprovalRequest) {
    return this.request<{
      message: string;
      documentId: string;
      documentStatus: string;
    }>(`/api/approval-process/cancel`, token, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  /**
   * 6. 내 결재 대기 목록 조회
   * GET /api/approval-process/my-pending
   */
  async getMyPendingApprovals(token: string) {
    return this.request<StepSnapshot[]>(
      `/api/approval-process/my-pending`,
      token,
      { method: "GET" }
    );
  }

  /**
   * 7. 문서의 결재 단계 조회
   * GET /api/approval-process/document/:documentId/steps
   */
  async getDocumentSteps(token: string, documentId: string) {
    return this.request<DocumentStepsResponse>(
      `/api/approval-process/document/${documentId}/steps`,
      token,
      { method: "GET" }
    );
  }

  // ============================================
  // Metadata API (v2)
  // Base URL: /api/metadata
  // ============================================

  /**
   * 1. 부서 목록 조회
   * GET /api/metadata/departments
   */
  async getDepartments(token: string) {
    return this.request<Department[]>(`/api/metadata/departments`, token, {
      method: "GET",
    });
  }

  /**
   * 2. 부서별 직원 조회
   * GET /api/metadata/departments/:departmentId/employees
   */
  async getDepartmentEmployees(
    token: string,
    departmentId: string,
    activeOnly = true
  ) {
    return this.request<Employee[]>(
      `/api/metadata/departments/${departmentId}/employees?activeOnly=${activeOnly}`,
      token,
      { method: "GET" }
    );
  }

  /**
   * 3. 계층구조 부서 및 직원 조회
   * GET /api/metadata/departments/hierarchy/with-employees
   */
  async getDepartmentHierarchyWithEmployees(token: string, activeOnly = true) {
    return this.request<DepartmentWithEmployees[]>(
      `/api/metadata/departments/hierarchy/with-employees?activeOnly=${activeOnly}`,
      token,
      { method: "GET" }
    );
  }

  /**
   * 4. 직원 검색
   * GET /api/metadata/employees
   */
  async searchEmployees(
    token: string,
    params?: { search?: string; departmentId?: string }
  ) {
    const query = new URLSearchParams();
    if (params?.search) query.append("search", params.search);
    if (params?.departmentId) query.append("departmentId", params.departmentId);

    const queryString = query.toString();
    return this.request<Employee[]>(
      `/api/metadata/employees${queryString ? `?${queryString}` : ""}`,
      token,
      { method: "GET" }
    );
  }

  /**
   * 5. 직원 상세 조회
   * GET /api/metadata/employees/:employeeId
   */
  async getEmployee(token: string, employeeId: string) {
    return this.request<Employee>(
      `/api/metadata/employees/${employeeId}`,
      token,
      {
        method: "GET",
      }
    );
  }

  /**
   * 6. 직책 목록 조회
   * GET /api/metadata/positions
   */
  async getPositions(token: string) {
    return this.request<Array<{ id: string; title: string }>>(
      `/api/metadata/positions`,
      token,
      { method: "GET" }
    );
  }

  // ============================================
  // Test Data API (v2)
  // Base URL: /api/test-data
  // ============================================

  /**
   * 1. JWT 액세스 토큰 생성
   * POST /api/test-data/token
   */
  async generateToken(data: { employeeNumber?: string; email?: string }) {
    return this.requestWithoutAuth<{
      success: boolean;
      message: string;
      accessToken: string;
      expiresIn: number;
      employee: {
        id: string;
        employeeNumber: string;
        name: string;
        email: string;
      };
    }>("/api/test-data/token", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  /**
   * 2. 시나리오 기반 테스트 데이터 생성
   * POST /api/test-data
   */
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
    }>("/api/test-data", token, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  /**
   * 3. 모든 테스트 데이터 삭제
   * DELETE /api/test-data/all
   */
  async deleteAllTestData(token: string) {
    return this.request<{
      success: boolean;
      message: string;
      data?: { deletedCount: number };
    }>("/api/test-data/all", token, {
      method: "DELETE",
    });
  }
}

export const apiServer = new ApiServer(BACKEND_API_URL);
