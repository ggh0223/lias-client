# LIAS 결재 시스템 클라이언트

LIAS 결재 시스템의 프론트엔드 애플리케이션입니다.

## 🎯 주요 기능

### 인증 & 대시보드

- ✅ JWT 토큰 기반 로그인 (`/login`)
- ✅ 대시보드 (`/dashboard`)
  - 결재 대기 건 요약
  - 내 문서 통계
  - 최근 활동 내역
  - 빠른 작업 링크

### 결재 관리

- ✅ 결재 대기 목록 (`/approval/pending`)
  - 내게 할당된 결재 건 조회
  - 결재 승인/반려
  - 협의 완료 처리
  - 시행 완료 처리

### 문서 관리 (구현 예정)

- 📝 내 문서 목록 (`/documents/my`)
- 📝 문서 작성 (`/documents/new`)
- 📝 문서 상세 (`/documents/[id]`)
- 📝 문서 수정
- 📝 문서 제출

### 관리자 기능 (구현 예정)

- 📝 문서양식 관리 (`/admin/forms`)
- 📝 결재선 관리 (`/admin/approval-lines`)

## 🏗 구조

````
lias-client/
├── app/
│   ├── login/                  # 로그인 페이지
│   ├── (main)/                 # 인증이 필요한 페이지
│   │   ├── layout.tsx          # 메인 레이아웃 (사이드바, 헤더)
│   │   ├── dashboard/          # 대시보드
│   │   ├── approval/           # 결재 관리
│   │   │   └── pending/        # 결재 대기 목록
│   │   ├── documents/          # 문서 관리 (TODO)
│   │   └── admin/              # 관리자 (TODO)
│   └── page.tsx                # 루트 (대시보드로 리다이렉트)
├── src/
│   ├── actions/
│   │   └── auth-actions.ts     # 서버 액션 (로그인, 로그아웃)
│   ├── lib/
│   │   ├── api-client.ts       # API 통신 클라이언트
│   │   └── auth.ts             # 인증 유틸리티
│   └── components/
│       └── layout/
│           └── main-layout.tsx # 메인 레이아웃 컴포넌트
└── API-DOCUMENTATION.md        # API 문서

## 🚀 시작하기

### 1. 환경 변수 설정

`.env.local` 파일 생성:

```bash
NEXT_PUBLIC_API_URL=http://localhost:3000
````

### 2. 개발 서버 실행

```bash
npm install
npm run dev
```

http://localhost:3001 에서 접속

### 3. 로그인

- 직원번호: `20230001`
- 또는 이메일: `user@company.com`

## 📡 API 통신

### API Client (`src/lib/api-client.ts`)

모든 API 통신은 `apiClient`를 통해 이루어집니다:

```typescript
import { apiClient } from "@/lib/api-client";

// 문서 조회
const documents = await apiClient.getMyDocuments(token);

// 결재 승인
await apiClient.approveStep(token, {
  stepSnapshotId: "step-id",
  comment: "승인합니다",
});
```

### 인증 (`src/lib/auth.ts`)

서버 사이드 및 클라이언트 사이드 인증 유틸리티:

```typescript
import { getToken, getUser } from "@/lib/auth";

// 서버 컴포넌트
const token = await getToken();
const user = await getUser();

// 클라이언트 컴포넌트
import { clientAuth } from "@/lib/auth";
const token = clientAuth.getToken();
```

## 📄 페이지 구성

### 로그인 페이지 (`/login`)

- 직원번호 또는 이메일로 로그인
- JWT 토큰 생성 및 저장
- 대시보드로 자동 이동

### 대시보드 (`/dashboard`)

- 통계 카드 (결재 대기, 내 문서, 임시저장, 진행 중)
- 최근 결재 대기 목록 (5건)
- 최근 문서 목록 (5건)
- 빠른 작업 버튼

### 결재 대기 목록 (`/approval/pending`)

- 좌측: 결재 대기 목록
- 우측: 선택된 결재 건 처리 패널
- 결재 승인/반려 (APPROVAL)
- 협의 완료 (AGREEMENT)
- 시행 완료 (IMPLEMENTATION)

## 🎨 UI/UX

- **프레임워크**: Next.js 14 (App Router)
- **스타일링**: Tailwind CSS
- **아이콘**: Emoji
- **레이아웃**:
  - 상단: 헤더 (로고, 사용자 정보, 로그아웃)
  - 좌측: 사이드바 (네비게이션)
  - 우측: 메인 컨텐츠

## 📝 TODO

### 문서 관리

- [ ] 내 문서 목록 페이지
- [ ] 문서 작성 페이지
- [ ] 문서 상세 페이지
- [ ] 문서 수정 기능
- [ ] 문서 제출 기능
- [ ] 문서 삭제 기능

### 관리자 기능

- [ ] 문서양식 목록 페이지
- [ ] 문서양식 생성/수정 페이지
- [ ] 결재선 템플릿 목록 페이지
- [ ] 결재선 템플릿 생성/수정 페이지

### 추가 기능

- [ ] 문서 검색 기능
- [ ] 필터링/정렬 기능
- [ ] 결재 이력 조회
- [ ] 알림 기능
- [ ] 문서 출력/다운로드

## 🔐 보안

- JWT 토큰은 httpOnly 쿠키에 저장
- 모든 API 요청에 Bearer 토큰 포함
- 서버 사이드에서 인증 검증
- 클라이언트 사이드는 로컬 스토리지 사용 (개발 편의성)

## 📚 참고

- [API 문서](./API-DOCUMENTATION.md)
- [백엔드 서버](../lias/)
