/**
 * 공통 타입 정의
 */

/**
 * JWT 토큰 페이로드
 */
export interface JWTPayload {
  employeeNumber: string; // 직원 번호
  iat: number; // 발급 시간
  exp: number; // 만료 시간
}

/**
 * API 응답 기본 구조
 */
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

/**
 * 페이지네이션 파라미터
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
}

/**
 * 페이지네이션 응답
 */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * 날짜 범위 필터
 */
export interface DateRangeFilter {
  startDate?: string;
  endDate?: string;
}
