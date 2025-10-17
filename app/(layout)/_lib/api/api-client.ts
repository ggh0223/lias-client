// API 클라이언트 - 공통 HTTP 요청 처리

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export interface RequestConfig {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  headers?: Record<string, string>;
  body?: unknown;
  queryParams?: Record<string, string | number | boolean>;
  requiresAuth?: boolean;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public response?: Record<string, unknown>
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// 공통 API 클라이언트
export class ApiClient {
  private static getAuthHeaders(): Record<string, string> {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      throw new ApiError("인증 토큰이 없습니다.");
    }

    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  }

  private static buildUrl(
    endpoint: string,
    queryParams?: Record<string, string | number | boolean>
  ): string {
    const url = new URL(`${API_BASE_URL}${endpoint}`);

    if (queryParams) {
      Object.entries(queryParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    return url.toString();
  }

  private static async handleResponse<T>(response: Response): Promise<T> {
    // 응답이 성공적이지 않은 경우
    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = {};
      }

      throw new ApiError(
        errorData.message || `HTTP ${response.status}: ${response.statusText}`,
        response.status,
        errorData
      );
    }

    // 응답 body가 없는 경우 (204 No Content, void 등)
    const contentType = response.headers.get("content-type");
    const contentLength = response.headers.get("content-length");

    if (
      response.status === 204 ||
      contentLength === "0" ||
      !contentType?.includes("application/json")
    ) {
      return undefined as T;
    }

    // JSON 응답 파싱
    try {
      return await response.json();
    } catch {
      // JSON 파싱 실패 시 빈 응답으로 처리
      return undefined as T;
    }
  }

  static async request<T>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<T> {
    const {
      method = "GET",
      headers = {},
      body,
      queryParams,
      requiresAuth = true,
    } = config;

    try {
      // 인증 헤더 추가
      const requestHeaders = requiresAuth
        ? { ...this.getAuthHeaders(), ...headers }
        : { "Content-Type": "application/json", ...headers };

      // URL 구성
      const url = this.buildUrl(endpoint, queryParams);

      // 요청 설정
      const requestConfig: RequestInit = {
        method,
        headers: requestHeaders,
      };

      // 바디 추가 (GET 요청이 아닌 경우)
      if (body && method !== "GET") {
        requestConfig.body = JSON.stringify(body);
      }

      // 요청 실행
      const response = await fetch(url, requestConfig);

      // 응답 처리
      return await this.handleResponse<T>(response);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        error instanceof Error
          ? error.message
          : "알 수 없는 오류가 발생했습니다."
      );
    }
  }

  // 편의 메서드들
  static async get<T>(
    endpoint: string,
    queryParams?: Record<string, string | number | boolean>,
    requiresAuth = true
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: "GET",
      queryParams,
      requiresAuth,
    });
  }

  static async post<T>(
    endpoint: string,
    body?: unknown,
    requiresAuth = true
  ): Promise<T> {
    return this.request<T>(endpoint, { method: "POST", body, requiresAuth });
  }

  static async put<T>(
    endpoint: string,
    body?: unknown,
    requiresAuth = true
  ): Promise<T> {
    return this.request<T>(endpoint, { method: "PUT", body, requiresAuth });
  }

  static async patch<T>(
    endpoint: string,
    body?: unknown,
    requiresAuth = true
  ): Promise<T> {
    return this.request<T>(endpoint, { method: "PATCH", body, requiresAuth });
  }

  static async delete<T>(endpoint: string, requiresAuth = true): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE", requiresAuth });
  }
}
