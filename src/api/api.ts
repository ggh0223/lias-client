const API_BASE_URL = "http://localhost:3070/api";

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

interface ErrorResponse {
  success: boolean;
  statusCode: number;
  message: string;
}

type RequestMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

// 토큰 가져오기 함수
const getAuthToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("accessToken");
  }
  return null;
};

// 토큰 저장 함수
export const setAuthToken = (token: string): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem("accessToken", token);
  }
};

// 토큰 제거 함수
export const removeAuthToken = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("accessToken");
  }
};

export async function fetchApi<T>(
  endpoint: string,
  method: RequestMethod = "GET",
  body?: unknown
): Promise<ApiResponse<T>> {
  try {
    const token = getAuthToken();
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    // 토큰이 있으면 Authorization 헤더에 추가
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const errorData: ErrorResponse = await response.json();

      // 401 에러 시 토큰 제거
      if (response.status === 401) {
        removeAuthToken();
      }

      throw new Error(errorData.message || "요청 처리 중 오류가 발생했습니다.");
    }

    const data: ApiResponse<T> = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    throw error;
  }
}
