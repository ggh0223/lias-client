# LIAS 결재 시스템 구현 가이드

## ✅ 완료된 기능

### 1. 인증 시스템

- ✅ JWT 토큰 기반 로그인 (`/login`)
- ✅ 토큰 저장 (쿠키 + 로컬 스토리지)
- ✅ 로그아웃
- ✅ 인증 가드 (서버 사이드)

**파일:**

- `src/lib/auth-server.ts` - 서버 인증 유틸리티
- `src/lib/auth-client.ts` - 클라이언트 인증 유틸리티
- `src/actions/auth-actions.ts` - 서버 액션
- `app/login/page.tsx` - 로그인 페이지

### 2. API 클라이언트

- ✅ RESTful API 통신
- ✅ JWT 토큰 자동 추가
- ✅ 에러 핸들링

**파일:**

- `src/lib/api-client.ts` - API 클라이언트

### 3. 레이아웃

- ✅ 메인 레이아웃 (헤더 + 사이드바)
- ✅ 네비게이션
- ✅ 사용자 정보 표시

**파일:**

- `src/components/layout/main-layout.tsx` - 메인 레이아웃
- `app/(main)/layout.tsx` - 레이아웃 래퍼

### 4. 대시보드

- ✅ 통계 카드 (결재 대기, 내 문서, 임시저장, 진행 중)
- ✅ 최근 결재 대기 목록
- ✅ 최근 문서 목록
- ✅ 빠른 작업 버튼

**파일:**

- `app/(main)/dashboard/page.tsx` - 서버 컴포넌트
- `app/(main)/dashboard/dashboard-client.tsx` - 클라이언트 컴포넌트

### 5. 결재 관리

- ✅ 결재 대기 목록 조회
- ✅ 결재 승인/반려 (APPROVAL)
- ✅ 협의 완료 (AGREEMENT)
- ✅ 시행 완료 (IMPLEMENTATION)
- ✅ 의견 작성

**파일:**

- `app/(main)/approval/pending/page.tsx` - 서버 컴포넌트
- `app/(main)/approval/pending/pending-client.tsx` - 클라이언트 컴포넌트

### 6. 문서 관리

- ✅ 내 문서 목록 조회
- ✅ 상태별 필터링
- ✅ 문서 작성 (임시저장)
- ✅ 문서 상세 조회
- ✅ 문서 삭제 (DRAFT 상태만)
- ✅ 결재 취소
- ✅ 결재 현황 조회

**파일:**

- `app/(main)/documents/my/page.tsx` - 내 문서 목록
- `app/(main)/documents/my/my-documents-client.tsx` - 클라이언트 컴포넌트
- `app/(main)/documents/new/page.tsx` - 문서 작성
- `app/(main)/documents/[id]/page.tsx` - 문서 상세
- `app/(main)/documents/[id]/document-detail-client.tsx` - 클라이언트 컴포넌트

## ✅ 완료된 추가 기능

### 1. 메타데이터 조회 API

부서, 직급, 직원 정보 조회

**구현 완료:**

```typescript
// 백엔드: src/modules_v2/business/metadata/controllers/metadata.controller.ts
// 프론트엔드: src/lib/api-client.ts - getDepartments, getPositions, searchEmployees 등
// - API: GET /metadata/departments
// - API: GET /metadata/positions
// - API: GET /metadata/employees
// - API: GET /metadata/approval-line-templates
// - API: GET /metadata/forms
```

### 2. 문서 제출 기능

문서를 결재선에 제출하는 기능

**구현 완료:**

```typescript
// app/(main)/documents/[id]/document-detail-client.tsx
// src/components/document/submit-document-modal.tsx
// - 제출 버튼 추가
// - 결재선 템플릿 선택 모달
// - 기안 컨텍스트 입력 (부서, 문서 금액, 유형)
// - 결재선 미리보기
// - API: POST /v2/document/:documentId/submit
```

### 3. 문서 수정 기능

문서 수정 페이지 및 기능

**구현 완료:**

```typescript
// app/(main)/documents/[id]/edit/page.tsx
// app/(main)/documents/[id]/edit/edit-client.tsx
// - DRAFT 상태 검증
// - 제목, 내용, 메타데이터 수정
// - API: PUT /v2/document/:documentId
```

### 4. 문서양식 관리

문서양식 생성, 수정, 조회

**구현 완료:**

```typescript
// app/(main)/admin/forms/
// - 문서양식 목록 (page.tsx, forms-list-client.tsx)
// - 문서양식 생성 (new/page.tsx)
// - 검색 및 필터링
// - API: GET /metadata/forms
// - API: POST /v2/approval-flow/forms
```

### 5. 결재선 템플릿 관리

결재선 템플릿 생성, 복제, 수정

**구현 완료:**

```typescript
// app/(main)/admin/approval-lines/
// - 결재선 템플릿 목록 (page.tsx, approval-lines-list-client.tsx)
// - 유형별 필터링 (공용/전용)
// - 검색 기능
// - API: GET /metadata/approval-line-templates
```

## 🚧 남은 기능 (선택사항)

### 6. 추가 기능

- 문서 검색
- 알림 기능
- 문서 출력/다운로드
- 결재 이력 조회
- 통계/대시보드 차트

## 🔧 개발 가이드

### API 통신 방법

```typescript
// 서버 컴포넌트에서
import { getToken } from "@/lib/auth-server";
import { apiClient } from "@/lib/api-client";

const token = await getToken();
const data = await apiClient.getMyDocuments(token);

// 클라이언트 컴포넌트에서
import { clientAuth } from "@/lib/auth-client";
import { apiClient } from "@/lib/api-client";

const token = clientAuth.getToken();
const data = await apiClient.getMyDocuments(token);
```

### 페이지 구조 패턴

**서버 컴포넌트 (page.tsx):**

- 데이터 페칭
- 인증 확인
- 클라이언트 컴포넌트로 props 전달

**클라이언트 컴포넌트 (\*-client.tsx):**

- 사용자 인터랙션
- 상태 관리
- API 호출 (mutation)

### 스타일링 가이드

**Tailwind CSS 클래스:**

- `bg-white shadow rounded-lg p-6` - 카드
- `text-2xl font-bold text-gray-900` - 제목
- `text-sm text-gray-500` - 서브텍스트
- `px-4 py-2 bg-blue-600 text-white rounded-md` - 버튼

## 🐛 알려진 이슈

1. **환경 변수**

   - `.env.local` 파일을 수동으로 생성해야 함
   - `NEXT_PUBLIC_API_URL=http://localhost:3000`

2. **토큰 관리**

   - 서버/클라이언트 간 토큰 동기화 필요
   - 토큰 만료 시 자동 재로그인 미구현

3. **에러 핸들링**
   - 전역 에러 핸들러 미구현
   - 네트워크 에러 처리 개선 필요

## 📝 다음 스텝 (선택사항)

### 개선 가능한 영역

1. **문서양식 편집 페이지**

   - 템플릿 편집기 (WYSIWYG)
   - 버전 관리 UI

2. **결재선 템플릿 상세/편집**

   - 단계별 상세 설정
   - 규칙 편집 UI
   - 복제 및 버전 생성

3. **권한 관리**

   - 역할 기반 접근 제어
   - 관리자 권한 검증

4. **고급 검색 및 필터**
   - 복합 검색 조건
   - 날짜 범위 필터
   - 저장된 검색 조건

## 🎯 테스트 방법

### 1. 로그인

```
직원번호: 20230001
또는 이메일: user@company.com
```

### 2. 문서 작성

```
- 문서양식 버전 ID 필요 (백엔드에서 조회)
- 제목, 내용 입력
- 임시저장 버튼 클릭
```

### 3. 결재 처리

```
- 결재 대기 목록에서 건 선택
- 승인/반려 버튼 클릭
- 의견 입력 (선택)
```

## 📚 참고 자료

- [API 문서](./API-DOCUMENTATION.md)
- [README](./README.md)
- [Next.js App Router 문서](https://nextjs.org/docs)
- [Tailwind CSS 문서](https://tailwindcss.com/docs)
