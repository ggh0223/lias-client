// 문서 관련 API 호출 함수

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

// 결재선 관련 타입 정의
export type ApprovalStepType = "AGREEMENT" | "APPROVAL";

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

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// 결재선 목록 조회
export const getFormApprovalLinesApi = async (): Promise<
  FormApprovalLine[]
> => {
  try {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      throw new Error("인증 토큰이 없습니다.");
    }

    const response = await fetch(
      `${API_BASE_URL}/api/document/approval-lines`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data: ApiResponse<FormApprovalLine[]> = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "결재선 목록 조회에 실패했습니다.");
    }

    return data.data;
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
    const token = localStorage.getItem("accessToken");

    if (!token) {
      throw new Error("인증 토큰이 없습니다.");
    }

    const response = await fetch(
      `${API_BASE_URL}/api/document/approval-lines/${id}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data: ApiResponse<FormApprovalLine> = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "결재선 상세 조회에 실패했습니다.");
    }

    return data.data;
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
    const token = localStorage.getItem("accessToken");

    if (!token) {
      throw new Error("인증 토큰이 없습니다.");
    }

    const response = await fetch(
      `${API_BASE_URL}/api/document/approval-lines`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      }
    );

    const data: ApiResponse<FormApprovalLine> = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "결재선 생성에 실패했습니다.");
    }

    return data.data;
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
    const token = localStorage.getItem("accessToken");

    if (!token) {
      throw new Error("인증 토큰이 없습니다.");
    }

    const response = await fetch(
      `${API_BASE_URL}/api/document/approval-lines/${id}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      }
    );

    const data: ApiResponse<FormApprovalLine> = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "결재선 수정에 실패했습니다.");
    }

    return data.data;
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
    const token = localStorage.getItem("accessToken");

    if (!token) {
      throw new Error("인증 토큰이 없습니다.");
    }

    const response = await fetch(
      `${API_BASE_URL}/api/document/approval-lines/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || "결재선 삭제에 실패했습니다.");
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("결재선 삭제 중 오류가 발생했습니다.");
  }
};
