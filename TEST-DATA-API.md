# Test Data API 문서

## 개요

Test Data API는 개발 및 테스트 환경에서 사용할 테스트 데이터를 생성하고 관리하는 API입니다.

- JWT 토큰 생성 (테스트용)
- 시나리오 기반 테스트 데이터 생성
- 테스트 데이터 삭제

**Base URL**: `/api/test-data`

**인증**: 대부분의 엔드포인트는 `Bearer Token` 인증이 필요합니다. (토큰 생성 API는 제외)

⚠️ **주의**: 이 API는 개발/테스트 환경에서만 사용해야 합니다!

---

## API 엔드포인트 목록

### 토큰 생성 API

1. [JWT 액세스 토큰 생성](#1-jwt-액세스-토큰-생성)

### 테스트 데이터 생성 API

2. [시나리오 기반 테스트 데이터 생성](#2-시나리오-기반-테스트-데이터-생성)

### 테스트 데이터 삭제 API

3. [모든 문서 및 결재 프로세스 삭제](#3-모든-문서-및-결재-프로세스-삭제)
4. [모든 결재선 및 양식 삭제](#4-모든-결재선-및-양식-삭제)
5. [모든 테스트 데이터 삭제](#5-모든-테스트-데이터-삭제)

---

## 1. JWT 액세스 토큰 생성

테스트 목적으로 JWT 액세스 토큰을 생성합니다.

**Endpoint**: `POST /api/test-data/token`

⚠️ **이 API는 인증이 필요하지 않습니다!**

**Request Body**:

```json
{
    "employeeNumber": "20230001"
}
```

또는

```json
{
    "email": "user@company.com"
}
```

**필드 설명**:

| 필드             | 타입   | 필수 | 설명      |
| ---------------- | ------ | ---- | --------- |
| `employeeNumber` | string | ❌   | 직원 번호 |
| `email`          | string | ❌   | 이메일    |

**참고**: employeeNumber 또는 email 중 하나는 필수입니다.

**Response 200 OK**:

```json
{
    "success": true,
    "message": "토큰이 생성되었습니다",
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 3600,
    "employee": {
        "id": "emp-uuid",
        "employeeNumber": "20230001",
        "name": "홍길동",
        "email": "hong@company.com"
    }
}
```

**에러 응답**:

- `400 Bad Request`: 잘못된 요청 (직원번호 또는 이메일 누락)
- `404 Not Found`: 직원을 찾을 수 없음

**테스트 시나리오**:

- ✅ 정상: 직원번호로 토큰 생성
- ✅ 정상: 이메일로 토큰 생성
- ❌ 실패: 직원번호와 이메일 모두 누락 (400 반환)
- ❌ 실패: 존재하지 않는 직원 (404 반환)

---

## 2. 시나리오 기반 테스트 데이터 생성

결재 시스템에서 발생할 수 있는 다양한 시나리오의 테스트 데이터를 생성합니다.

**Endpoint**: `POST /api/test-data`

### 지원 시나리오

#### 1️⃣ SIMPLE_APPROVAL (간단한 결재)

기안자 → 부서장 → 본부장 → 완료

- 기본적인 3단계 결재 흐름
- 기안자가 첫 번째 결재자로 포함됨

#### 2️⃣ MULTI_LEVEL_APPROVAL (복잡한 다단계 결재)

기안자 → 팀장 → 부서장 → 본부장 → 완료

- 4단계 결재 흐름
- 순차적 결재 진행 (이전 단계 완료 필수)

#### 3️⃣ AGREEMENT_PROCESS (협의 프로세스)

기안자 → 협의자 2명 동시 검토 → 부서장 → 완료

- 협의는 순서 무관하게 동시 진행 가능
- 모든 협의 완료 후 결재 진행

#### 4️⃣ IMPLEMENTATION_PROCESS (시행 프로세스)

기안자 → 부서장 → 시행자 실행 → 완료

- 모든 결재 완료 후 시행 가능
- 시행 완료 시 IMPLEMENTED 상태

#### 5️⃣ REJECTED_DOCUMENT (반려 시나리오)

기안자 → 부서장 반려 → REJECTED 상태

- 결재 중 반려 발생
- 순서가 되어야 반려 가능

#### 6️⃣ CANCELLED_DOCUMENT (취소 시나리오)

기안자 → 진행 중 기안자가 취소 → CANCELLED 상태

- 기안자만 취소 가능
- PENDING 상태에서만 취소 가능

#### 7️⃣ WITH_REFERENCE (참조자 포함)

기안자 → 결재 진행 → 참조자들에게 알림

- 참조자는 처리 불필요
- 열람만 가능

#### 8️⃣ PARALLEL_AGREEMENT (병렬 협의)

기안자 → 여러 부서 동시 협의 → 최종 승인

- 여러 협의자가 동시 협의
- 모든 협의 완료 후 결재 진행

#### 9️⃣ FULL_PROCESS (전체 프로세스)

기안자 → 협의 → 결재 → 시행 → 참조 (모든 단계 포함)

- 모든 유형의 단계가 포함된 종합 시나리오
- 실제 업무 프로세스와 가장 유사

#### 🔟 NO_APPROVAL_LINE (결재선 없는 양식)

결재선이 없는 양식으로 문서 생성 → 자동 결재선 생성

- 양식에 결재선이 연결되지 않은 상태
- 문서 제출 시 자동으로 계층적 결재선 생성
- 기안자 → 부서장 → 상위 부서장 → 최상위까지 자동 생성

### 추가 옵션

- **documentCount**: 생성할 문서 개수 (1-10)
- **titlePrefix**: 문서 제목 접두사
- **progress**: 시나리오 진행 정도 (0: 초기/DRAFT, 50: 중간/진행중, 100: 완료)

**Request Body**:

```json
{
    "scenario": "SIMPLE_APPROVAL",
    "documentCount": 1,
    "titlePrefix": "지출 결의서",
    "progress": 0
}
```

**필드 설명**:

| 필드            | 타입   | 필수 | 설명                                   |
| --------------- | ------ | ---- | -------------------------------------- |
| `scenario`      | enum   | ✅   | 생성할 테스트 데이터 시나리오          |
| `documentCount` | number | ❌   | 생성할 문서 개수 (기본값: 1, 최대: 10) |
| `titlePrefix`   | string | ❌   | 문서 제목 접두사                       |
| `progress`      | number | ❌   | 시나리오 진행 정도 (0-100)             |

**지원되는 시나리오** (TestDataScenario):

- `SIMPLE_APPROVAL`: 간단한 결재
- `MULTI_LEVEL_APPROVAL`: 복잡한 다단계 결재
- `AGREEMENT_PROCESS`: 협의 프로세스
- `IMPLEMENTATION_PROCESS`: 시행 프로세스
- `REJECTED_DOCUMENT`: 반려 시나리오
- `CANCELLED_DOCUMENT`: 취소 시나리오
- `WITH_REFERENCE`: 참조자 포함
- `PARALLEL_AGREEMENT`: 병렬 협의
- `FULL_PROCESS`: 전체 프로세스
- `NO_APPROVAL_LINE`: 결재선 없는 양식

**Response 201 Created**:

```json
{
    "success": true,
    "message": "테스트 데이터가 생성되었습니다",
    "data": {
        "forms": ["form-uuid"],
        "formVersions": ["form-version-uuid"],
        "documents": ["document-uuid"],
        "approvalLineTemplates": ["template-uuid"],
        "approvalLineTemplateVersions": ["template-version-uuid"],
        "approvalStepTemplates": ["step-template-uuid"],
        "approvalLineSnapshots": ["snapshot-uuid"],
        "approvalStepSnapshots": ["step-snapshot-uuid"]
    }
}
```

**에러 응답**:

- `400 Bad Request`: 잘못된 요청 (시나리오 누락, 잘못된 값 등)
- `401 Unauthorized`: 인증 실패

**순서 검증 규칙**:

1. **협의**: 순서 무관, 동시 진행 가능
2. **결재**: 협의 완료 + 이전 결재 완료 필수
3. **시행**: 모든 협의 + 모든 결재 완료 필수
4. **반려**: 협의 완료 + 이전 결재 완료 필수

**테스트 시나리오**:

- ✅ 정상: 모든 시나리오로 테스트 데이터 생성
- ✅ 정상: documentCount로 여러 문서 생성
- ✅ 정상: progress로 시나리오 진행 상태 설정
- ❌ 실패: 시나리오 누락 (400 반환)
- ❌ 실패: 잘못된 시나리오 값 (400 반환)
- ❌ 실패: documentCount가 범위를 벗어남 (400 반환)
- ❌ 실패: 인증 토큰 없음 (401 반환)

---

## 3. 모든 문서 및 결재 프로세스 삭제

모든 문서, 결재 스냅샷, 결재 단계를 삭제합니다.

**Endpoint**: `DELETE /api/test-data/documents`

### 삭제 대상

- 📄 모든 문서 (Documents)
- 📸 결재선 스냅샷 (ApprovalLineSnapshots)
- 📋 결재 단계 스냅샷 (ApprovalStepSnapshots)

**Response 200 OK**:

```json
{
    "success": true,
    "message": "모든 문서 및 결재 프로세스가 삭제되었습니다"
}
```

**에러 응답**:

- `401 Unauthorized`: 인증 실패

**주의사항**:

- ⚠️ 이 작업은 되돌릴 수 없습니다
- ⚠️ 개발/테스트 환경에서만 사용하세요
- ⚠️ 실제 운영 데이터도 모두 삭제됩니다

---

## 4. 모든 결재선 및 양식 삭제

모든 결재선 템플릿, 문서 양식, 관련 버전을 삭제합니다.

**Endpoint**: `DELETE /api/test-data/forms-and-templates`

### 삭제 대상

- 📋 문서양식 (Forms)
- 📝 문서양식 버전 (FormVersions)
- 🔗 양식-결재선 연결 (FormVersionApprovalLineTemplateVersions)
- 📜 결재선 템플릿 (ApprovalLineTemplates)
- 📜 결재선 템플릿 버전 (ApprovalLineTemplateVersions)
- 📌 결재 단계 템플릿 (ApprovalStepTemplates)

**Response 200 OK**:

```json
{
    "success": true,
    "message": "모든 결재선 및 양식이 삭제되었습니다"
}
```

**에러 응답**:

- `400 Bad Request`: 문서가 먼저 삭제되지 않음 (외래키 제약)
- `401 Unauthorized`: 인증 실패

**주의사항**:

- ⚠️ 이 작업은 되돌릴 수 없습니다
- ⚠️ 개발/테스트 환경에서만 사용하세요
- ⚠️ 실제 운영 데이터도 모두 삭제됩니다
- ⚠️ 문서가 먼저 삭제되어야 합니다 (외래키 제약)

---

## 5. 모든 테스트 데이터 삭제

모든 테스트 데이터를 한 번에 삭제합니다 (문서 + 결재 프로세스 + 결재선 + 양식).

**Endpoint**: `DELETE /api/test-data/all`

### 삭제 순서

1. 문서 및 결재 프로세스
2. 결재선 및 양식

**Response 200 OK**:

```json
{
    "success": true,
    "message": "모든 테스트 데이터가 삭제되었습니다"
}
```

**에러 응답**:

- `401 Unauthorized`: 인증 실패

**주의사항**:

- ⚠️ 이 작업은 되돌릴 수 없습니다
- ⚠️ 개발/테스트 환경에서만 사용하세요
- ⚠️ 실제 운영 데이터도 모두 삭제됩니다
- 🔴 **매우 위험한 작업입니다!**

---

## 공통 에러 응답

### 400 Bad Request

잘못된 요청입니다. 필수 파라미터 누락, 잘못된 시나리오 값 등이 원인입니다.

```json
{
    "statusCode": 400,
    "message": "시나리오를 선택해주세요",
    "error": "Bad Request"
}
```

### 401 Unauthorized

인증이 필요합니다. Bearer Token을 헤더에 포함해야 합니다.

```json
{
    "statusCode": 401,
    "message": "Unauthorized",
    "error": "인증 실패"
}
```

### 404 Not Found

요청한 리소스를 찾을 수 없습니다.

```json
{
    "statusCode": 404,
    "message": "직원을 찾을 수 없습니다",
    "error": "Not Found"
}
```

---

## 주요 시나리오 설명

### SIMPLE_APPROVAL

가장 기본적인 결재 흐름을 테스트합니다.

**결재 라인**:

- 결재자 1: 고정 결재자
- 결재자 2: 기안자의 상급자

**프로세스**:

- DRAFT → PENDING → APPROVED

### MULTI_LEVEL_APPROVAL

복잡한 다단계 결재 흐름을 테스트합니다.

**결재 라인**:

- 결재자 1: 고정 결재자
- 결재자 2: 기안자의 상급자
- 결재자 3: 고정 결재자 (상위)

**프로세스**:

- 순차적 결재 진행 (이전 단계 완료 필수)

### AGREEMENT_PROCESS

협의 프로세스를 테스트합니다.

**결재 라인**:

- 협의자 1: 고정 협의자
- 협의자 2: 고정 협의자
- 결재자: 기안자의 상급자

**프로세스**:

- 협의는 순서 무관하게 동시 진행 가능
- 모든 협의 완료 후 결재 진행

### IMPLEMENTATION_PROCESS

시행 프로세스를 테스트합니다.

**결재 라인**:

- 결재자: 기안자의 상급자
- 시행자: 고정 시행자

**프로세스**:

- 결재 완료 후 시행 가능
- 시행 완료 시 IMPLEMENTED 상태

### REJECTED_DOCUMENT

반려 시나리오를 테스트합니다.

**결재 라인**:

- 결재자: 기안자의 상급자

**프로세스**:

- 결재 중 반려 발생
- REJECTED 상태로 종료

### CANCELLED_DOCUMENT

취소 시나리오를 테스트합니다.

**결재 라인**:

- 결재자: 기안자의 상급자

**프로세스**:

- 진행 중 기안자가 취소
- CANCELLED 상태로 종료

### WITH_REFERENCE

참조자 포함 시나리오를 테스트합니다.

**결재 라인**:

- 결재자: 기안자의 상급자
- 참조자: 부서 전체

**프로세스**:

- 참조자는 처리 불필요
- 열람만 가능

### PARALLEL_AGREEMENT

병렬 협의 시나리오를 테스트합니다.

**결재 라인**:

- 협의자 1: 고정 협의자
- 협의자 2: 고정 협의자
- 결재자: 기안자의 상급자

**프로세스**:

- 여러 협의자가 동시 협의
- 모든 협의 완료 후 결재 진행

### FULL_PROCESS

전체 프로세스를 테스트합니다.

**결재 라인**:

- 협의자 1: 고정 협의자
- 협의자 2: 고정 협의자
- 결재자 1: 고정 결재자
- 결재자 2: 기안자의 상급자
- 시행자: 고정 시행자
- 참조자: 부서 전체

**프로세스**:

- 모든 유형의 단계가 포함된 종합 시나리오
- 실제 업무 프로세스와 가장 유사

### NO_APPROVAL_LINE

결재선 자동 생성 기능을 테스트합니다.

**문서 양식**:

- 결재선이 연결되지 않은 상태

**프로세스**:

- 문서 제출 시 자동으로 계층적 결재선 생성
- 기안자 → 부서장 → 상위 부서장 → 최상위까지

---

## 순서 검증 규칙

### 협의 단계

- 순서 제약 없음
- 모든 협의자가 동시에 처리 가능
- 완료 여부가 결재 진행에 영향 없음 (단, 결재 전 모든 협의 완료 권장)

### 결재 단계

- 순차 처리 (이전 결재 완료 후 다음 결재 가능)
- 협의가 있다면 모든 협의 완료 후 결재 가능
- 승인 또는 반려 가능

### 시행 단계

- 모든 협의와 결재 완료 후 처리 가능
- 시행 결과 보고 및 데이터 저장

---

## 테스트 시나리오

### 정상 시나리오

- ✅ 모든 시나리오로 테스트 데이터 생성
- ✅ documentCount로 여러 문서 생성
- ✅ progress로 시나리오 진행 상태 설정
- ✅ 특정 시나리오 생성
- ✅ 전체 데이터 삭제

### 예외 시나리오

- ❌ 시나리오 누락 (400 반환)
- ❌ 잘못된 시나리오 값 (400 반환)
- ❌ documentCount가 범위를 벗어남 (400 반환)
- ❌ progress가 범위를 벗어남 (400 반환)
- ❌ 인증 토큰 없음 (401 반환)
- ❌ 존재하지 않는 직원 (404 반환)

---

## 주의사항

### ⚠️ 개발/테스트 환경 전용

이 API는 개발 및 테스트 환경에서만 사용하세요!

### ⚠️ 데이터 삭제는 되돌릴 수 없음

모든 삭제 작업은 영구적으로 데이터를 제거합니다.

### ⚠️ 운영 데이터도 영향받음

실제 운영 데이터도 함께 삭제될 수 있습니다.

### ⚠️ 외래키 제약

양식 및 템플릿을 삭제하기 전에 먼저 문서를 삭제해야 합니다.

---

## 추천 사용 순서

### 1. 테스트 환경 초기화

```bash
# 전체 데이터 삭제
DELETE /api/test-data/all
```

### 2. 토큰 생성

```bash
# 테스트용 토큰 생성
POST /api/test-data/token
Body: { "employeeNumber": "20230001" }
```

### 3. 테스트 데이터 생성

```bash
# 특정 시나리오 생성
POST /api/test-data
Body: {
  "scenario": "SIMPLE_APPROVAL",
  "documentCount": 1,
  "titlePrefix": "테스트 문서",
  "progress": 0
}
```

### 4. 테스트 진행

실제 결재 프로세스를 테스트합니다.

### 5. 테스트 후 정리

```bash
# 전체 데이터 삭제
DELETE /api/test-data/all
```
