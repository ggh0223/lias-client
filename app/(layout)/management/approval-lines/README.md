# 결재선 관리 페이지

## 개요

결재선을 생성, 조회, 수정, 삭제할 수 있는 관리 페이지입니다.

## 주요 기능

### 1. 결재선 목록 조회

- 공통 결재선과 개인화 결재선을 탭으로 구분하여 표시
- 결재선 이름과 설명으로 검색 가능
- 결재선 상태, 타입, 단계 정보 표시

### 2. 결재선 생성

- 결재선 기본 정보 입력 (이름, 설명, 타입)
- 결재 단계 정보 설정 (단계 타입, 순서, 기본 결재자)
- 실시간 유효성 검사

### 3. 결재선 수정

- 기존 결재선 정보 수정
- 모든 필드 편집 가능
- 변경사항 실시간 반영

### 4. 결재선 상세 보기

- 결재선의 모든 상세 정보 표시
- 기본 결재자 정보 포함
- 생성/수정 일시 정보

### 5. 결재선 삭제

- 확인 다이얼로그를 통한 안전한 삭제
- 삭제 후 목록 자동 갱신

## 파일 구조

```
approval-lines/
├── page.tsx                           # 메인 페이지 컴포넌트
├── _hooks/
│   └── use-approval-lines.ts         # 결재선 관리 커스텀 훅
├── _components/
│   ├── approval-line-table.tsx       # 결재선 목록 테이블
│   ├── approval-line-dialog.tsx      # 생성/수정 다이얼로그
│   └── approval-line-detail-dialog.tsx # 상세 보기 다이얼로그
└── README.md                         # 이 파일
```

## API 연동

### 사용된 API

- `GET /api/document/approval-lines` - 결재선 목록 조회
- `GET /api/document/approval-lines/{id}` - 결재선 상세 조회
- `POST /api/document/approval-lines` - 결재선 생성
- `PATCH /api/document/approval-lines/{id}` - 결재선 수정
- `DELETE /api/document/approval-lines/{id}` - 결재선 삭제

### 데이터 타입

- `FormApprovalLine` - 결재선 정보
- `CreateFormApprovalLineRequest` - 생성 요청 데이터
- `UpdateFormApprovalLineRequest` - 수정 요청 데이터

## 상태 관리

### 로컬 상태

- `activeTab` - 현재 선택된 탭 (common/personal)
- `searchTerm` - 검색어
- `isCreateModalOpen` - 생성 다이얼로그 열림 상태
- `isEditModalOpen` - 수정 다이얼로그 열림 상태
- `isDetailModalOpen` - 상세 보기 다이얼로그 열림 상태
- `selectedApprovalLine` - 선택된 결재선 정보

### 커스텀 훅 상태

- `approvalLines` - 전체 결재선 목록
- `loading` - 로딩 상태
- `error` - 에러 상태

## 사용자 인터페이스

### 디자인 시스템

- Tailwind CSS를 사용한 일관된 디자인
- 반응형 레이아웃 지원
- 접근성을 고려한 UI 구성

### 주요 컴포넌트

1. **탭 네비게이션** - 공통/개인화 결재선 구분
2. **검색 바** - 실시간 검색 기능
3. **데이터 테이블** - 정렬 및 필터링 지원
4. **모달 다이얼로그** - 생성/수정/상세 보기
5. **로딩 상태** - 스피너 및 스켈레톤 UI
6. **에러 처리** - 사용자 친화적 에러 메시지

## 에러 처리

### 네트워크 에러

- API 호출 실패 시 적절한 에러 메시지 표시
- 재시도 기능 제공

### 유효성 검사

- 필수 필드 검증
- 데이터 형식 검증
- 실시간 피드백

## 성능 최적화

### 데이터 캐싱

- 커스텀 훅을 통한 상태 관리
- 불필요한 API 호출 방지

### 렌더링 최적화

- 컴포넌트 분리를 통한 리렌더링 최소화
- 메모이제이션 활용

## 향후 개선 사항

1. **페이지네이션** - 대량 데이터 처리
2. **고급 필터링** - 다중 조건 검색
3. **일괄 작업** - 다중 선택 및 일괄 삭제
4. **내보내기 기능** - Excel/PDF 내보내기
5. **히스토리 관리** - 변경 이력 추적
6. **권한 관리** - 역할별 접근 제어
