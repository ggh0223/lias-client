# Document API 문서

## 개요

Document API는 문서 생명주기 관리 및 결재선 제출을 담당하는 API입니다.

- 문서 생성 (임시저장)
- 문서 수정
- 문서 제출 (결재선 자동 생성 지원)
- 문서 삭제
- 문서 조회

**Base URL**: `/api/document`

**인증**: 모든 엔드포인트는 `Bearer Token` 인증이 필요합니다.

---

## API 엔드포인트 목록

### 생성/수정 API

1. [문서 생성](#1-문서-생성)
2. [문서 수정](#2-문서-수정)
3. [문서 제출](#3-문서-제출)
4. [문서 삭제](#4-문서-삭제)

### 조회 API

5. [문서 조회](#5-문서-조회)
6. [내 문서 조회](#6-내-문서-조회)
7. [상태별 문서 조회](#7-상태별-문서-조회)

---

## 1. 문서 생성

새로운 문서를 생성합니다 (임시저장 상태).

**Endpoint**: `POST /api/document`

### 주요 기능

- 문서 생성 시 결재선 커스터마이징 지원
- 다양한 assigneeRule 지원
- 임시저장 시에도 결재선 스냅샷 생성

**Request Body**:

```json
{
    "formVersionId": "123e4567-e89b-12d3-a456-426614174001",
    "title": "2025년 1분기 예산안",
    "content": "<p>예산안 내용</p>",
    "metadata": {
        "urgency": "high"
    }
}
```

**필드 설명**:

| 필드            | 타입          | 필수 | 설명              |
| --------------- | ------------- | ---- | ----------------- |
| `formVersionId` | string (UUID) | ✅   | 문서 양식 버전 ID |
| `title`         | string        | ✅   | 문서 제목         |
| `content`       | string        | ✅   | 문서 내용 (HTML)  |
| `metadata`      | object        | ❌   | 메타데이터 (JSON) |

**Response 201 Created**:

```json
{
    "id": "document-uuid",
    "formId": "form-uuid",
    "formVersionId": "form-version-uuid",
    "title": "2025년 1분기 예산안",
    "drafterId": "employee-uuid",
    "drafterDepartmentId": "dept-uuid",
    "status": "DRAFT",
    "content": "<p>예산안 내용</p>",
    "metadata": {
        "urgency": "high"
    },
    "documentNumber": null,
    "approvalLineSnapshotId": "snapshot-uuid",
    "submittedAt": null,
    "cancelReason": null,
    "cancelledAt": null,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
}
```

**에러 응답**:

- `400 Bad Request`: 잘못된 요청 (필수 파라미터 누락)
- `401 Unauthorized`: 인증 실패
- `404 Not Found`: 양식을 찾을 수 없음

**테스트 시나리오**:

- ✅ 정상: 새로운 문서 생성 (임시저장)
- ✅ 정상: metadata 없이 문서 생성
- ✅ 정상: customApprovalSteps와 함께 문서 생성
- ✅ 정상: 다양한 assigneeRule로 결재선 커스터마이징
- ❌ 실패: 필수 필드 누락 (formVersionId, title, content)
- ❌ 실패: 존재하지 않는 formVersionId (404 반환)
- ❌ 실패: 잘못된 assigneeRule (400 반환)
- ❌ 실패: 인증 토큰 없음 (401 반환)

---

## 2. 문서 수정

임시저장 상태의 문서를 수정합니다.

**Endpoint**: `PUT /api/document/:documentId`

**Path Parameters**:

| 파라미터     | 타입   | 설명    |
| ------------ | ------ | ------- |
| `documentId` | string | 문서 ID |

**Request Body**:

```json
{
    "title": "2025년 1분기 예산안 (수정)",
    "content": "<p>수정된 예산안 내용</p>",
    "metadata": {
        "urgency": "medium"
    }
}
```

**필드 설명**:

| 필드       | 타입   | 필수 | 설명              |
| ---------- | ------ | ---- | ----------------- |
| `title`    | string | ❌   | 문서 제목         |
| `content`  | string | ❌   | 문서 내용 (HTML)  |
| `metadata` | object | ❌   | 메타데이터 (JSON) |

**Response 200 OK**:

```json
{
    "id": "document-uuid",
    "formId": "form-uuid",
    "formVersionId": "form-version-uuid",
    "title": "2025년 1분기 예산안 (수정)",
    "drafterId": "employee-uuid",
    "drafterDepartmentId": "dept-uuid",
    "status": "DRAFT",
    "content": "<p>수정된 예산안 내용</p>",
    "metadata": {
        "urgency": "medium"
    },
    "documentNumber": null,
    "approvalLineSnapshotId": "snapshot-uuid",
    "submittedAt": null,
    "cancelReason": null,
    "cancelledAt": null,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T12:00:00Z"
}
```

**에러 응답**:

- `400 Bad Request`: 잘못된 요청 (제출된 문서 수정 시도)
- `401 Unauthorized`: 인증 실패
- `403 Forbidden`: 권한 없음 (다른 사용자의 문서)
- `404 Not Found`: 문서를 찾을 수 없음

**테스트 시나리오**:

- ✅ 정상: DRAFT 상태 문서 수정
- ✅ 정상: 일부 필드만 수정
- ❌ 실패: 존재하지 않는 문서 ID (404 반환)
- ❌ 실패: 제출된 문서(PENDING) 수정 시도 (400 반환)
- ❌ 실패: 다른 사용자의 문서 수정 시도 (403 반환)
- ❌ 실패: 인증 토큰 없음 (401 반환)

---

## 3. 문서 제출

문서를 결재선에 제출합니다.

**Endpoint**: `POST /api/document/:documentId/submit`

**Path Parameters**:

| 파라미터     | 타입   | 설명    |
| ------------ | ------ | ------- |
| `documentId` | string | 문서 ID |

### 결재선 자동 생성 정책

1. **문서 양식에 결재선이 설정되어 있으면** 해당 결재선 사용
2. **문서 양식에 결재선이 없으면** 자동으로 계층적 결재선 생성:
    - 기안자 → 기안자의 부서장 → 상위 부서장 → ... (최상위까지)
    - 기안자가 부서장인 경우 해당 단계는 건너뜀
    - drafterDepartmentId가 없으면 자동으로 기안자의 주 소속 부서 조회

### AssigneeRule 해석

- `FIXED`: 고정 결재자 (employeeId 사용)
- `DRAFTER`: 기안자 본인
- `DRAFTER_SUPERIOR`: 기안자의 상급자
- `DEPARTMENT_HEAD`: 지정된 부서의 부서장
- `POSITION_BASED`: 지정된 직책의 담당자
- `DEPARTMENT_REFERENCE`: 지정된 부서의 모든 직원 (REFERENCE 타입에서만 사용)

**Request Body**:

```json
{
    "draftContext": {
        "drafterDepartmentId": "dept-uuid",
        "documentAmount": 1000000,
        "documentType": "BUDGET"
    },
    "customApprovalSteps": [
        {
            "stepOrder": 1,
            "stepType": "APPROVAL",
            "isRequired": true,
            "employeeId": "employee-uuid",
            "assigneeRule": "FIXED"
        }
    ]
}
```

**필드 설명**:

**draftContext**:

| 필드                  | 타입          | 필수 | 설명                                                  |
| --------------------- | ------------- | ---- | ----------------------------------------------------- |
| `drafterDepartmentId` | string (UUID) | ❌   | 기안 부서 ID (미입력시 직원의 주 소속 부서 자동 사용) |
| `documentAmount`      | number        | ❌   | 문서 금액 (향후 금액 기반 결재선 분기용)              |
| `documentType`        | string        | ❌   | 문서 유형 (향후 유형별 결재선 분기용)                 |

**customApprovalSteps** (선택사항):

| 필드           | 타입    | 필수 | 설명                         |
| -------------- | ------- | ---- | ---------------------------- |
| `stepOrder`    | number  | ✅   | 단계 순서                    |
| `stepType`     | string  | ✅   | 단계 타입                    |
| `isRequired`   | boolean | ✅   | 필수 여부                    |
| `employeeId`   | string  | ❌   | 담당자 직원 ID (개별 선택시) |
| `departmentId` | string  | ❌   | 담당 부서 ID (부서 선택시)   |
| `assigneeRule` | string  | ✅   | 담당자 할당 규칙             |

**Response 200 OK**:

```json
{
    "id": "document-uuid",
    "formId": "form-uuid",
    "formVersionId": "form-version-uuid",
    "title": "2025년 1분기 예산안",
    "drafterId": "employee-uuid",
    "drafterDepartmentId": "dept-uuid",
    "status": "PENDING",
    "content": "<p>예산안 내용</p>",
    "metadata": {
        "urgency": "high"
    },
    "documentNumber": "DOC-2024-001",
    "approvalLineSnapshotId": "snapshot-uuid",
    "submittedAt": "2024-01-01T00:00:00Z",
    "cancelReason": null,
    "cancelledAt": null,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
}
```

**에러 응답**:

- `400 Bad Request`: 잘못된 요청 (이미 제출된 문서, 결재선 생성 실패 등)
- `401 Unauthorized`: 인증 실패
- `404 Not Found`: 문서를 찾을 수 없음

**테스트 시나리오**:

- ✅ 정상: 문서 제출 (DRAFT → PENDING)
- ✅ 정상: 결재선이 없는 양식으로 제출 (자동 결재선 생성)
- ✅ 정상: customApprovalSteps와 함께 문서 제출
- ✅ 정상: 다양한 assigneeRule로 결재선 커스터마이징
- ❌ 실패: 이미 제출된 문서 재제출 시도 (400 반환)
- ❌ 실패: 존재하지 않는 문서 ID (404 반환)
- ❌ 실패: 결재선도 없고 부서 정보도 없음 (400 반환)
- ❌ 실패: 잘못된 assigneeRule (400 반환)
- ❌ 실패: 인증 토큰 없음 (401 반환)

---

## 4. 문서 삭제

임시저장 상태의 문서를 삭제합니다.

**Endpoint**: `DELETE /api/document/:documentId`

**Path Parameters**:

| 파라미터     | 타입   | 설명    |
| ------------ | ------ | ------- |
| `documentId` | string | 문서 ID |

**Response 200 OK**:

```json
{
    "message": "문서가 삭제되었습니다",
    "documentId": "document-uuid"
}
```

**에러 응답**:

- `400 Bad Request`: 잘못된 요청 (제출된 문서 삭제 시도)
- `401 Unauthorized`: 인증 실패
- `403 Forbidden`: 권한 없음 (다른 사용자의 문서)
- `404 Not Found`: 문서를 찾을 수 없음

**테스트 시나리오**:

- ✅ 정상: DRAFT 상태 문서 삭제
- ❌ 실패: 제출된 문서(PENDING) 삭제 시도 (400 반환)
- ❌ 실패: 존재하지 않는 문서 ID (404 반환)
- ❌ 실패: 이미 삭제된 문서 재삭제 시도 (404 반환)
- ❌ 실패: 다른 사용자의 문서 삭제 시도 (403 반환)
- ❌ 실패: 인증 토큰 없음 (401 반환)

---

## 5. 문서 조회

ID로 문서를 조회합니다.

**Endpoint**: `GET /api/document/:documentId`

**Path Parameters**:

| 파라미터     | 타입   | 설명    |
| ------------ | ------ | ------- |
| `documentId` | string | 문서 ID |

**Response 200 OK**:

```json
{
    "id": "document-uuid",
    "formId": "form-uuid",
    "formVersionId": "form-version-uuid",
    "title": "2025년 1분기 예산안",
    "drafterId": "employee-uuid",
    "drafterDepartmentId": "dept-uuid",
    "status": "PENDING",
    "content": "<p>예산안 내용</p>",
    "metadata": {
        "urgency": "high"
    },
    "documentNumber": "DOC-2024-001",
    "approvalLineSnapshotId": "snapshot-uuid",
    "submittedAt": "2024-01-01T00:00:00Z",
    "cancelReason": null,
    "cancelledAt": null,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
}
```

**에러 응답**:

- `401 Unauthorized`: 인증 실패
- `404 Not Found`: 문서를 찾을 수 없음

**테스트 시나리오**:

- ✅ 정상: 특정 문서 조회
- ✅ 정상: 다른 사용자의 문서 조회 가능 (조회 권한)
- ❌ 실패: 존재하지 않는 문서 ID (404 반환)
- ❌ 실패: 인증 토큰 없음 (401 반환)

---

## 6. 내 문서 조회

내가 작성한 모든 문서를 조회합니다.

**Endpoint**: `GET /api/document/my-documents`

**Response 200 OK**:

```json
[
    {
        "id": "document-uuid-1",
        "formId": "form-uuid",
        "formVersionId": "form-version-uuid",
        "title": "휴가 신청서",
        "drafterId": "employee-uuid",
        "drafterDepartmentId": "dept-uuid",
        "status": "DRAFT",
        "content": "<p>휴가 내용</p>",
        "metadata": null,
        "documentNumber": null,
        "approvalLineSnapshotId": null,
        "submittedAt": null,
        "cancelReason": null,
        "cancelledAt": null,
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-01-01T00:00:00Z"
    },
    {
        "id": "document-uuid-2",
        "formId": "form-uuid",
        "formVersionId": "form-version-uuid",
        "title": "예산 신청서",
        "drafterId": "employee-uuid",
        "drafterDepartmentId": "dept-uuid",
        "status": "PENDING",
        "content": "<p>예산 내용</p>",
        "metadata": {
            "urgency": "high"
        },
        "documentNumber": "DOC-2024-001",
        "approvalLineSnapshotId": "snapshot-uuid",
        "submittedAt": "2024-01-01T12:00:00Z",
        "cancelReason": null,
        "cancelledAt": null,
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-01-01T12:00:00Z"
    }
]
```

**에러 응답**:

- `401 Unauthorized`: 인증 실패

**테스트 시나리오**:

- ✅ 정상: 내가 작성한 모든 문서 조회
- ✅ 정상: 작성자 확인 (drafterId 일치)
- ❌ 실패: 인증 토큰 없음 (401 반환)

---

## 7. 상태별 문서 조회

특정 상태의 모든 문서를 조회합니다.

**Endpoint**: `GET /api/document/status/:status`

**Path Parameters**:

| 파라미터 | 타입   | 설명      |
| -------- | ------ | --------- |
| `status` | string | 문서 상태 |

**지원되는 상태**:

- `DRAFT`: 임시저장
- `PENDING`: 결재 진행중
- `APPROVED`: 승인 완료
- `REJECTED`: 반려
- `CANCELLED`: 취소
- `IMPLEMENTED`: 시행 완료

**Response 200 OK**:

```json
[
    {
        "id": "document-uuid",
        "formId": "form-uuid",
        "formVersionId": "form-version-uuid",
        "title": "2025년 1분기 예산안",
        "drafterId": "employee-uuid",
        "drafterDepartmentId": "dept-uuid",
        "status": "PENDING",
        "content": "<p>예산안 내용</p>",
        "metadata": {
            "urgency": "high"
        },
        "documentNumber": "DOC-2024-001",
        "approvalLineSnapshotId": "snapshot-uuid",
        "submittedAt": "2024-01-01T00:00:00Z",
        "cancelReason": null,
        "cancelledAt": null,
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-01-01T00:00:00Z"
    }
]
```

**에러 응답**:

- `400 Bad Request`: 잘못된 상태 값
- `401 Unauthorized`: 인증 실패

**테스트 시나리오**:

- ✅ 정상: DRAFT 상태 문서 조회
- ✅ 정상: PENDING 상태 문서 조회
- ✅ 정상: APPROVED 상태 문서 조회 (빈 배열 가능)
- ❌ 실패: 잘못된 상태 값 (400 반환)
- ❌ 실패: 인증 토큰 없음 (401 반환)

---

## 공통 에러 응답

### 400 Bad Request

잘못된 요청입니다. 필수 파라미터 누락, 잘못된 상태 등이 원인입니다.

```json
{
    "statusCode": 400,
    "message": "제출된 문서는 수정할 수 없습니다",
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

### 403 Forbidden

권한이 없습니다. 다른 사용자의 문서를 수정/삭제하려고 시도한 경우입니다.

```json
{
    "statusCode": 403,
    "message": "이 문서를 수정할 권한이 없습니다",
    "error": "Forbidden"
}
```

### 404 Not Found

요청한 리소스를 찾을 수 없습니다.

```json
{
    "statusCode": 404,
    "message": "문서를 찾을 수 없습니다",
    "error": "Not Found"
}
```

---

## 주요 Enum 값

### DocumentStatus (문서 상태)

- `DRAFT`: 임시저장
- `PENDING`: 결재 진행중
- `APPROVED`: 승인 완료
- `REJECTED`: 반려
- `CANCELLED`: 취소
- `IMPLEMENTED`: 시행 완료

---

## 문서 생명주기

### 1. 문서 작성 및 임시저장

```
[문서 생성] → DRAFT 상태
    ↓
[문서 수정] → DRAFT 상태 유지
```

### 2. 문서 제출

```
[문서 제출] → PENDING 상태
    ↓
[결재 프로세스 진행] → APPROVED / REJECTED / CANCELLED
```

### 3. 결재 완료 후

```
[시행 완료] → IMPLEMENTED 상태
```

---

## 결재선 자동 생성 규칙

### 경우 1: 양식에 결재선이 있는 경우

문서 양식에 설정된 결재선 사용

### 경우 2: 양식에 결재선이 없는 경우

자동으로 계층적 결재선 생성:

1. 기안자 확인
2. 기안자의 부서장 찾기
3. 상위 부서장 순차적으로 찾기
4. 최상위 부서장까지

**계층 예시**:

```
개발팀 → IT본부 → 전략개발그룹 → 최고경영진
```

**건너뛰기 규칙**:

- 기안자가 부서장인 경우 해당 단계 건너뛰기
- 이미 상위 부서에 포함된 경우 중복 제거

---

## 테스트 시나리오

### 정상 시나리오

- ✅ 새로운 문서 생성 (임시저장)
- ✅ 문서 수정
- ✅ 문서 제출 (결재선 자동 생성)
- ✅ 문서 제출 (커스텀 결재선)
- ✅ 내 문서 조회
- ✅ 상태별 문서 조회
- ✅ 특정 문서 조회

### 예외 시나리오

- ❌ 필수 필드 누락
- ❌ 존재하지 않는 formVersionId (404 반환)
- ❌ 제출된 문서 수정 시도 (400 반환)
- ❌ 제출된 문서 삭제 시도 (400 반환)
- ❌ 다른 사용자의 문서 수정/삭제 시도 (403 반환)
- ❌ 잘못된 상태 값 (400 반환)
- ❌ 인증 토큰 없음 (401 반환)
