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

export async function fetchApi<T>(
  endpoint: string,
  method: RequestMethod = "GET",
  body?: unknown
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        // 추후 인증 토큰 추가
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const errorData: ErrorResponse = await response.json();
      throw new Error(errorData.message || "요청 처리 중 오류가 발생했습니다.");
    }

    const data: ApiResponse<T> = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    throw error;
  }
}
