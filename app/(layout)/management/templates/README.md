# 문서양식 관리

문서양식을 생성, 조회, 수정, 삭제할 수 있는 관리 페이지입니다.

## 개요

문서양식 관리 페이지는 회사 내에서 사용되는 다양한 문서 양식을 생성, 수정, 삭제할 수 있는 관리 기능을 제공합니다. 각 문서양식은 HTML 템플릿을 기반으로 하며, 수신자/참조자 정보, 시행자 정보, 결재선 등을 설정할 수 있습니다.

## 기능

### 1. 문서양식 목록 조회

- 등록된 모든 문서양식을 테이블 형태로 표시
- 양식명, 설명, 카테고리, 결재선 정보 제공
- 페이지네이션 지원
- 로딩 상태 및 빈 데이터 상태 처리

### 2. 문서양식 검색

- 양식명으로 실시간 검색
- 서버 사이드 필터링

### 3. 문서양식 생성

- 양식명, 설명, 템플릿, 수신자/시행자 정보, 카테고리, 결재선 입력
- HTML 템플릿 에디터
- 동적 수신자/시행자 정보 추가/삭제
- 유효성 검사 (필수 필드 확인)
- 생성 후 목록 자동 갱신

### 4. 문서양식 수정

- 기존 양식 정보 수정
- 수정 후 목록 자동 갱신

### 5. 문서양식 삭제

- 삭제 확인 다이얼로그
- 삭제 후 목록 자동 갱신

### 6. 문서양식 상세 보기

- 문서양식 상세 정보 조회 (TODO: 구현 예정)

## 컴포넌트 구조

```
templates/
├── page.tsx                           # 메인 페이지 컴포넌트
├── _hooks/
│   └── use-document-forms.ts         # 문서양식 관리 커스텀 훅
├── _components/
│   ├── document-form-table.tsx       # 문서양식 테이블 컴포넌트
│   ├── document-form-dialog.tsx      # 생성/수정 다이얼로그 컴포넌트
│   └── pagination.tsx                # 페이지네이션 컴포넌트
└── README.md                          # 이 파일
```

## API 연동

### 사용하는 API 엔드포인트

- `GET /api/document/forms` - 문서양식 목록 조회 (페이지네이션 지원)
- `GET /api/document/forms/{id}` - 문서양식 상세 조회
- `POST /api/document/forms` - 문서양식 생성
- `PATCH /api/document/forms/{id}` - 문서양식 수정
- `DELETE /api/document/forms/{id}` - 문서양식 삭제
- `GET /api/document/form-types` - 문서양식 분류 목록 조회 (카테고리 선택용)

### 데이터 타입

```typescript
interface DocumentForm {
  documentFormId: string;
  name: string;
  description: string;
  template: string;
  receiverInfo: string[];
  implementerInfo: string[];
  documentType: DocumentFormType;
  formApprovalLine: FormApprovalLine;
}

interface CreateDocumentFormRequest {
  name: string;
  description?: string;
  template: string;
  receiverInfo: string[];
  implementerInfo: string[];
  documentTypeId: string;
  formApprovalLineId: string;
}

interface UpdateDocumentFormRequest {
  name?: string;
  description?: string;
  template?: string;
  receiverInfo?: string[];
  implementerInfo?: string[];
  documentTypeId?: string;
  formApprovalLineId?: string;
  documentFormId: string;
}
```

## 상태 관리

### 커스텀 훅: useDocumentForms

- 문서양식 목록 상태 관리
- 페이지네이션 상태 관리
- 로딩 및 에러 상태 관리
- CRUD 작업 함수 제공
- 검색 기능 제공

### 주요 상태

- `documentForms`: 문서양식 목록
- `paginationMeta`: 페이지네이션 메타데이터
- `isLoading`: 로딩 상태
- `error`: 에러 메시지
- `searchTerm`: 검색어

## UI/UX 특징

### 디자인 시스템

- 루미르 디자인 시스템의 라이트 테마 색상 사용
- 일관된 스타일링 (결재선, 카테고리 페이지와 동일한 패턴)

### 반응형 디자인

- 모바일 및 데스크톱 환경 지원
- 테이블 가로 스크롤 처리
- 그리드 레이아웃 활용

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
- 동적 필드 추가/삭제
- 모달 스크롤 처리

## 페이지네이션

### 기능

- 페이지 번호 표시
- 이전/다음 버튼
- 페이지 건너뛰기 (말줄임표)
- 현재 페이지 하이라이트
- 전체 아이템 수 표시

### 구현 세부사항

- 최대 5개 페이지 번호 표시
- 현재 페이지 기준으로 좌우 2페이지씩 표시
- 첫 페이지와 마지막 페이지는 항상 표시
- 페이지 간격은 말줄임표로 표시

## 폼 기능

### 템플릿 에디터

- HTML 템플릿 입력
- 모노스페이스 폰트 사용
- 10줄 높이의 텍스트 영역

### 동적 필드 관리

- 수신자/참조자 정보 동적 추가/삭제
- 시행자 정보 동적 추가/삭제
- 최소 1개 필드 유지
- 빈 필드 자동 필터링

### 유효성 검사

- 필수 필드 검증 (양식명, 템플릿, 카테고리, 결재선)
- 빈 값 처리
- 트림 처리

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
- 페이지네이션을 통한 데이터 분할 로드

## 향후 개선 사항

### TODO

- 문서양식 상세 보기 기능 구현
- 결재선 목록 연동 (현재 임시 데이터 사용)
- 템플릿 미리보기 기능
- 템플릿 에디터 개선 (코드 하이라이팅, 자동완성 등)
- 파일 업로드 기능
- 템플릿 버전 관리
- 사용 통계 표시
