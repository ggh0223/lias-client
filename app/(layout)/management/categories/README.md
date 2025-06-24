# 문서양식 분류 관리

문서양식 분류를 생성, 조회, 수정, 삭제할 수 있는 관리 페이지입니다.

## 기능

### 1. 문서양식 분류 목록 조회

- 등록된 모든 문서양식 분류를 테이블 형태로 표시
- 분류명, 문서 번호 코드, 생성일 정보 제공
- 로딩 상태 및 빈 데이터 상태 처리

### 2. 문서양식 분류 검색

- 분류명 또는 문서 번호 코드로 실시간 검색
- 클라이언트 사이드 필터링

### 3. 문서양식 분류 생성

- 분류명과 문서 번호 코드 입력
- 유효성 검사 (필수 필드 확인)
- 생성 후 목록 자동 갱신

### 4. 문서양식 분류 수정

- 기존 분류 정보 수정
- 수정 후 목록 자동 갱신

### 5. 문서양식 분류 삭제

- 삭제 확인 다이얼로그
- 삭제 후 목록 자동 갱신

## 컴포넌트 구조

```
categories/
├── page.tsx                           # 메인 페이지 컴포넌트
├── _hooks/
│   └── use-document-form-types.ts     # 문서양식 분류 관리 커스텀 훅
├── _components/
│   ├── document-form-type-table.tsx   # 문서양식 분류 테이블 컴포넌트
│   └── document-form-type-dialog.tsx  # 생성/수정 다이얼로그 컴포넌트
└── README.md                          # 이 파일
```

## API 연동

### 사용하는 API 엔드포인트

- `GET /api/document/form-types` - 문서양식 분류 목록 조회
- `GET /api/document/form-types/{id}` - 문서양식 분류 상세 조회
- `POST /api/document/form-types` - 문서양식 분류 생성
- `PATCH /api/document/form-types/{id}` - 문서양식 분류 수정
- `DELETE /api/document/form-types/{id}` - 문서양식 분류 삭제

### 데이터 타입

```typescript
interface DocumentFormType {
  documentTypeId: string;
  name: string;
  documentNumberCode: string;
}

interface CreateDocumentFormTypeRequest {
  name: string;
  documentNumberCode: string;
}

interface UpdateDocumentFormTypeRequest {
  name?: string;
  documentNumberCode?: string;
  documentTypeId: string;
}
```

## 상태 관리

### 커스텀 훅: useDocumentFormTypes

- 문서양식 분류 목록 상태 관리
- 로딩 및 에러 상태 관리
- CRUD 작업 함수 제공
- 검색 기능 제공

### 주요 상태

- `documentFormTypes`: 문서양식 분류 목록
- `isLoading`: 로딩 상태
- `error`: 에러 메시지
- `searchTerm`: 검색어

## UI/UX 특징

### 디자인 시스템

- 루미르 디자인 시스템의 라이트 테마 색상 사용
- 일관된 스타일링 (결재선 페이지와 동일한 패턴)

### 반응형 디자인

- 모바일 및 데스크톱 환경 지원
- 테이블 가로 스크롤 처리

### 접근성

- 키보드 네비게이션 지원
- 적절한 ARIA 속성 사용
- 시맨틱 HTML 구조

### 사용자 경험

- 로딩 상태 표시
- 에러 메시지 표시
- 삭제 확인 다이얼로그
- 실시간 검색
- 폼 유효성 검사

## 에러 처리

### API 에러

- 네트워크 오류 처리
- 서버 에러 메시지 표시
- 사용자 친화적인 에러 메시지

### 유효성 검사

- 필수 필드 검증
- 입력 데이터 검증
- 클라이언트 사이드 검증

## 성능 최적화

### 상태 관리 최적화

- 불필요한 리렌더링 방지
- 메모이제이션 활용
- 효율적인 상태 업데이트

### API 호출 최적화

- 중복 API 호출 방지
- 적절한 에러 처리
- 로딩 상태 관리
