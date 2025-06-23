# 인증 시스템 설정 가이드

## 개요

이 프로젝트는 JWT 토큰 기반의 인증 시스템을 사용합니다. 로그인 후 토큰이 로컬 스토리지에 저장되며, 페이지 이동 시 자동으로 인증 상태를 확인합니다.

## 폴더 구조

```
lias-client/
├── app/
│   ├── (layout)/
│   │   ├── _lib/
│   │   │   ├── auth/
│   │   │   │   ├── auth-utils.ts      # 토큰 관리, 검증 함수
│   │   │   │   ├── auth-guard.tsx     # 인증 가드 컴포넌트
│   │   │   │   └── auth-provider.tsx  # 인증 상태 관리
│   │   │   └── api/
│   │   │       └── auth-api.ts        # 인증 API 호출 함수
│   │   └── ...
│   └── (no-layout)/
│       └── login/                     # 로그인 페이지
└── src/
    └── _action/
        └── auth/
            └── auth-actions.ts        # 서버 액션
```

## 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```env
# API 설정
NEXT_PUBLIC_API_URL=http://localhost:3001

# 개발 환경 설정
NODE_ENV=development
```

## 주요 기능

### 1. 인증 상태 관리 (AuthProvider)

- 전역 인증 상태 관리
- 토큰 자동 검증
- 사용자 정보 관리
- 로그인/로그아웃 기능

### 2. 인증 가드 (AuthGuard)

- 인증이 필요한 페이지 보호
- 권한 기반 접근 제어
- 자동 리다이렉트

### 3. 토큰 관리 (auth-utils)

- JWT 토큰 저장/조회/삭제
- 토큰 유효성 검사
- 사용자 정보 관리

### 4. API 호출 (auth-api)

- 로그인 API 호출
- 사용자 정보 조회
- 토큰 갱신 (필요시)

## 사용 방법

### 1. 로그인 페이지

```tsx
import { useAuth } from "../_lib/auth/auth-provider";

const { login } = useAuth();

const handleLogin = async (email: string, password: string) => {
  try {
    await login(email, password);
    // 로그인 성공 후 리다이렉트
  } catch (error) {
    // 에러 처리
  }
};
```

### 2. 인증이 필요한 페이지

```tsx
import { AuthGuard } from "../_lib/auth/auth-guard";

export default function ProtectedPage() {
  return (
    <AuthGuard>
      <div>인증된 사용자만 접근 가능한 페이지</div>
    </AuthGuard>
  );
}
```

### 3. 권한이 필요한 페이지

```tsx
import { AuthGuard } from "../_lib/auth/auth-guard";

export default function AdminPage() {
  return (
    <AuthGuard requiredRoles={["admin"]}>
      <div>관리자만 접근 가능한 페이지</div>
    </AuthGuard>
  );
}
```

### 4. 사용자 정보 사용

```tsx
import { useAuth } from '../_lib/auth/auth-provider';

const { user, logout } = useAuth();

// 사용자 정보 표시
<div>안녕하세요, {user?.name}님</div>

// 로그아웃
<button onClick={logout}>로그아웃</button>
```

## API 명세

### 로그인 API

- **Method:** `POST`
- **Endpoint:** `/api/auth/login`
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "accessToken": "jwt_token_here",
      "email": "user@example.com",
      "name": "홍길동",
      "department": "개발팀",
      "position": "팀장",
      "rank": "사원",
      "roles": ["user"]
    }
  }
  ```

### 사용자 정보 조회 API

- **Method:** `GET`
- **Endpoint:** `/api/auth/me`
- **Headers:** `Authorization: Bearer {token}`
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "email": "user@example.com",
      "name": "홍길동",
      "department": "개발팀",
      "position": "팀장",
      "rank": "사원",
      "roles": ["user"]
    }
  }
  ```

## 보안 고려사항

1. **토큰 저장**: JWT 토큰은 로컬 스토리지에 저장됩니다.
2. **토큰 만료**: 토큰 만료 시 자동으로 로그아웃됩니다.
3. **HTTPS**: 프로덕션 환경에서는 반드시 HTTPS를 사용하세요.
4. **토큰 갱신**: 필요시 토큰 갱신 로직을 구현하세요.

## 문제 해결

### 1. 로그인 실패

- API 서버가 실행 중인지 확인
- 환경 변수 `NEXT_PUBLIC_API_URL` 설정 확인
- 네트워크 연결 상태 확인

### 2. 토큰 만료

- 브라우저 개발자 도구에서 로컬 스토리지 확인
- 토큰 갱신 로직 구현 필요

### 3. 권한 오류

- 사용자 역할(roles) 확인
- AuthGuard의 requiredRoles 설정 확인

## 개발 팁

1. **개발자 도구**: 브라우저 개발자 도구의 Application 탭에서 로컬 스토리지 확인
2. **네트워크 탭**: API 호출 상태 및 응답 확인
3. **콘솔 로그**: 인증 관련 로그 확인
