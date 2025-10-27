# Approval Process API 문서

## 개요

Approval Process API는 실제 결재 프로세스 실행을 담당하는 API입니다.

- 결재 승인/반려 처리
- 협의 완료 처리
- 시행 완료 처리
- 결재 취소
- 결재 대기 목록 조회
- 문서별 결재 단계 조회

**Base URL**: `/api/approval-process`

**인증**: 모든 엔드포인트는 `Bearer Token` 인증이 필요합니다.

---

## API 엔드포인트 목록

### 결재 처리 API

1. [결재 승인](#1-결재-승인)
2. [결재 반려](#2-결재-반려)
3. [협의 완료](#3-협의-완료)
4. [시행 완료](#4-시행-완료)
5. [결재 취소](#5-결재-취소)

### 조회 API

6. [내 결재 대기 목록 조회](#6-내-결재-대기-목록-조회)
7. [문서의 결재 단계 조회](#7-문서의-결재-단계-조회)

---

## 1. 결재 승인

결재 단계를 승인합니다.

**Endpoint**: `POST /api/approval-process/approve`

### 순서 검증 규칙

1. 협의가 있다면 모든 협의가 완료되어야 결재 가능
2. 이전 결재 단계가 완료되어야 현재 단계 승인 가능

### AssigneeRule별 권한 검증

- `FIXED`: 지정된 고정 결재자만 승인 가능
- `DRAFTER`: 기안자 본인만 승인 가능
- `DRAFTER_SUPERIOR`: 기안자의 상급자만 승인 가능
- `DEPARTMENT_HEAD`: 해당 부서의 부서장만 승인 가능
- `POSITION_BASED`: 해당 직책의 담당자만 승인 가능

**Request Body**:

```json
{
    "stepSnapshotId": "123e4567-e89b-12d3-a456-426614174000",
    "comment": "승인합니다"
}
```

**필드 설명**:

| 필드             | 타입          | 필수 | 설명                 |
| ---------------- | ------------- | ---- | -------------------- |
| `stepSnapshotId` | string (UUID) | ✅   | 결재 단계 스냅샷 ID  |
| `comment`        | string        | ❌   | 결재 의견 (선택사항) |

**Response 200 OK**:

```json
{
    "id": "step-snapshot-uuid",
    "snapshotId": "snapshot-uuid",
    "stepOrder": 1,
    "stepType": "APPROVAL",
    "approverId": "approver-uuid",
    "approverName": "홍길동",
    "approverDepartmentId": "dept-uuid",
    "approverDepartmentName": "개발팀",
    "approverPositionId": "pos-uuid",
    "approverPositionTitle": "팀장",
    "assigneeRule": "FIXED",
    "status": "APPROVED",
    "comment": "승인합니다",
    "approvedAt": "2024-01-01T00:00:00Z",
    "isRequired": true,
    "createdAt": "2024-01-01T00:00:00Z",
    "documentId": "document-uuid",
    "documentTitle": "휴가 신청서",
    "documentNumber": "DOC-2024-001",
    "drafterId": "drafter-uuid",
    "drafterName": "김철수",
    "drafterDepartmentName": "개발팀",
    "documentStatus": "PENDING",
    "submittedAt": "2024-01-01T00:00:00Z"
}
```

**에러 응답**:

- `400 Bad Request`: 잘못된 요청 (순서 위반, 이미 승인된 단계 재승인 등)
- `401 Unauthorized`: 인증 실패
- `403 Forbidden`: 권한 없음
- `404 Not Found`: 결재 단계를 찾을 수 없음

**테스트 시나리오**:

- ✅ 정상: 결재 승인 (의견 포함)
- ✅ 정상: 의견 없이 승인
- ❌ 실패: 필수 필드 누락 (stepSnapshotId)
- ❌ 실패: 존재하지 않는 stepSnapshotId (404 반환)
- ❌ 실패: 권한 없는 사용자(기안자)가 승인 시도 (403 반환)
- ❌ 실패: 이미 승인된 단계 재승인 시도 (400 반환)
- ❌ 실패: 협의가 완료되지 않은 상태에서 결재 시도 (400 반환)
- ❌ 실패: 첫 번째 결재가 완료되지 않은 상태에서 두 번째 결재 시도 (400 반환)
- ❌ 실패: 인증 토큰 없음 (401 반환)

---

## 2. 결재 반려

결재 단계를 반려합니다.

**Endpoint**: `POST /api/approval-process/reject`

### 순서 검증 규칙

1. 협의가 있다면 모든 협의가 완료되어야 반려 가능
2. 이전 결재 단계가 완료되어야 현재 단계 반려 가능
   (반려도 차례가 되어야 가능)

**Request Body**:

```json
{
    "stepSnapshotId": "123e4567-e89b-12d3-a456-426614174000",
    "comment": "예산안이 부적절합니다"
}
```

**필드 설명**:

| 필드             | 타입          | 필수 | 설명                |
| ---------------- | ------------- | ---- | ------------------- |
| `stepSnapshotId` | string (UUID) | ✅   | 결재 단계 스냅샷 ID |
| `comment`        | string        | ✅   | 반려 사유 (필수)    |

**Response 200 OK**:

```json
{
    "id": "step-snapshot-uuid",
    "snapshotId": "snapshot-uuid",
    "stepOrder": 1,
    "stepType": "APPROVAL",
    "approverId": "approver-uuid",
    "approverName": "홍길동",
    "approverDepartmentId": "dept-uuid",
    "approverDepartmentName": "개발팀",
    "approverPositionId": "pos-uuid",
    "approverPositionTitle": "팀장",
    "assigneeRule": "FIXED",
    "status": "REJECTED",
    "comment": "예산안이 부적절합니다",
    "approvedAt": "2024-01-01T00:00:00Z",
    "isRequired": true,
    "createdAt": "2024-01-01T00:00:00Z",
    "documentId": "document-uuid",
    "documentTitle": "예산 신청서",
    "documentNumber": "DOC-2024-001",
    "drafterId": "drafter-uuid",
    "drafterName": "김철수",
    "drafterDepartmentName": "개발팀",
    "documentStatus": "REJECTED",
    "submittedAt": "2024-01-01T00:00:00Z"
}
```

**에러 응답**:

- `400 Bad Request`: 잘못된 요청 (반려 사유 필수, 순서 위반 포함)
- `401 Unauthorized`: 인증 실패
- `403 Forbidden`: 권한 없음
- `404 Not Found`: 결재 단계를 찾을 수 없음

**테스트 시나리오**:

- ✅ 정상: 결재 반려 (사유 포함)
- ❌ 실패: 필수 필드 누락 (stepSnapshotId)
- ❌ 실패: 필수 필드 누락 (comment - 반려 사유)
- ❌ 실패: 존재하지 않는 stepSnapshotId (404 반환)
- ❌ 실패: 권한 없는 사용자가 반려 시도 (403 반환)
- ❌ 실패: 협의가 완료되지 않은 상태에서 결재 반려 시도 (400 반환)
- ❌ 실패: 첫 번째 결재가 완료되지 않은 상태에서 두 번째 결재 반려 시도 (400 반환)
- ❌ 실패: 인증 토큰 없음 (401 반환)

---

## 3. 협의 완료

협의 단계를 완료 처리합니다.

**Endpoint**: `POST /api/approval-process/agreement/complete`

**Request Body**:

```json
{
    "stepSnapshotId": "123e4567-e89b-12d3-a456-426614174000",
    "comment": "검토 완료했습니다"
}
```

**필드 설명**:

| 필드             | 타입          | 필수 | 설명                 |
| ---------------- | ------------- | ---- | -------------------- |
| `stepSnapshotId` | string (UUID) | ✅   | 협의 단계 스냅샷 ID  |
| `comment`        | string        | ❌   | 협의 의견 (선택사항) |

**Response 200 OK**:

```json
{
    "id": "step-snapshot-uuid",
    "snapshotId": "snapshot-uuid",
    "stepOrder": 1,
    "stepType": "AGREEMENT",
    "approverId": "approver-uuid",
    "approverName": "홍길동",
    "approverDepartmentId": "dept-uuid",
    "approverDepartmentName": "회계팀",
    "approverPositionId": "pos-uuid",
    "approverPositionTitle": "팀원",
    "assigneeRule": "FIXED",
    "status": "APPROVED",
    "comment": "검토 완료했습니다",
    "approvedAt": "2024-01-01T00:00:00Z",
    "isRequired": false,
    "createdAt": "2024-01-01T00:00:00Z",
    "documentId": "document-uuid",
    "documentTitle": "예산 신청서",
    "documentNumber": "DOC-2024-001",
    "drafterId": "drafter-uuid",
    "drafterName": "김철수",
    "drafterDepartmentName": "개발팀",
    "documentStatus": "PENDING",
    "submittedAt": "2024-01-01T00:00:00Z"
}
```

**에러 응답**:

- `400 Bad Request`: 잘못된 요청
- `401 Unauthorized`: 인증 실패
- `403 Forbidden`: 권한 없음
- `404 Not Found`: 협의 단계를 찾을 수 없음

**테스트 시나리오**:

- ✅ 정상: 협의 완료 (의견 포함)
- ❌ 실패: 필수 필드 누락 (stepSnapshotId)
- ❌ 실패: 존재하지 않는 stepSnapshotId (404 반환)
- ❌ 실패: 인증 토큰 없음 (401 반환)

---

## 4. 시행 완료

시행 단계를 완료 처리합니다.

**Endpoint**: `POST /api/approval-process/implementation/complete`

### 순서 검증 규칙

1. 모든 협의가 완료되어야 시행 가능
2. 모든 결재가 완료되어야 시행 가능

**Request Body**:

```json
{
    "stepSnapshotId": "123e4567-e89b-12d3-a456-426614174000",
    "comment": "예산 집행 완료했습니다",
    "resultData": {
        "executionDate": "2025-01-15",
        "amount": 1000000
    }
}
```

**필드 설명**:

| 필드             | 타입          | 필수 | 설명                    |
| ---------------- | ------------- | ---- | ----------------------- |
| `stepSnapshotId` | string (UUID) | ✅   | 시행 단계 스냅샷 ID     |
| `comment`        | string        | ❌   | 시행 결과 메모          |
| `resultData`     | object        | ❌   | 시행 결과 데이터 (JSON) |

**Response 200 OK**:

```json
{
    "id": "step-snapshot-uuid",
    "snapshotId": "snapshot-uuid",
    "stepOrder": 4,
    "stepType": "IMPLEMENTATION",
    "approverId": "approver-uuid",
    "approverName": "홍길동",
    "approverDepartmentId": "dept-uuid",
    "approverDepartmentName": "총무팀",
    "approverPositionId": "pos-uuid",
    "approverPositionTitle": "팀원",
    "assigneeRule": "FIXED",
    "status": "APPROVED",
    "comment": "예산 집행 완료했습니다",
    "approvedAt": "2024-01-01T00:00:00Z",
    "isRequired": true,
    "createdAt": "2024-01-01T00:00:00Z",
    "documentId": "document-uuid",
    "documentTitle": "예산 신청서",
    "documentNumber": "DOC-2024-001",
    "drafterId": "drafter-uuid",
    "drafterName": "김철수",
    "drafterDepartmentName": "개발팀",
    "documentStatus": "IMPLEMENTED",
    "submittedAt": "2024-01-01T00:00:00Z"
}
```

**에러 응답**:

- `400 Bad Request`: 잘못된 요청 (순서 위반 포함)
- `401 Unauthorized`: 인증 실패
- `403 Forbidden`: 권한 없음
- `404 Not Found`: 시행 단계를 찾을 수 없음

**테스트 시나리오**:

- ✅ 정상: 시행 완료 (의견 포함)
- ❌ 실패: 필수 필드 누락 (stepSnapshotId)
- ❌ 실패: 존재하지 않는 stepSnapshotId (404 반환)
- ❌ 실패: 협의가 완료되지 않은 상태에서 시행 시도 (400 반환)
- ❌ 실패: 결재가 완료되지 않은 상태에서 시행 시도 (400 반환)
- ❌ 실패: 인증 토큰 없음 (401 반환)

---

## 5. 결재 취소

문서 결재를 취소합니다 (기안자만 가능).

**Endpoint**: `POST /api/approval-process/cancel`

**Request Body**:

```json
{
    "documentId": "123e4567-e89b-12d3-a456-426614174000",
    "reason": "내용 수정이 필요합니다"
}
```

**필드 설명**:

| 필드         | 타입          | 필수 | 설명             |
| ------------ | ------------- | ---- | ---------------- |
| `documentId` | string (UUID) | ✅   | 문서 ID          |
| `reason`     | string        | ✅   | 취소 사유 (필수) |

**Response 200 OK**:

```json
{
    "message": "결재가 취소되었습니다",
    "documentId": "document-uuid",
    "documentStatus": "CANCELLED"
}
```

**에러 응답**:

- `400 Bad Request`: 잘못된 요청
- `401 Unauthorized`: 인증 실패
- `403 Forbidden`: 권한 없음 (기안자가 아닌 경우)
- `404 Not Found`: 문서를 찾을 수 없음

**테스트 시나리오**:

- ✅ 정상: 기안자가 결재 취소
- ❌ 실패: 필수 필드 누락 (documentId)
- ❌ 실패: 필수 필드 누락 (reason)
- ❌ 실패: 기안자가 아닌 사용자가 취소 시도 (403 반환)
- ❌ 실패: 존재하지 않는 문서 ID (404 반환)
- ❌ 실패: 인증 토큰 없음 (401 반환)

---

## 6. 내 결재 대기 목록 조회

나에게 할당된 결재 대기 건 중 실제 처리 가능한 건만 조회합니다.

**Endpoint**: `GET /api/approval-process/my-pending`

### 필터링 규칙

1. **협의**: 언제나 처리 가능 (순서 무관)
2. **결재**: 협의 완료 + 이전 결재 완료된 건만
3. **시행**: 모든 협의 + 모든 결재 완료된 건만
4. **참조**: 처리 불필요 (목록에서 제외)

**Response 200 OK**:

```json
[
    {
        "id": "step-snapshot-uuid",
        "snapshotId": "snapshot-uuid",
        "stepOrder": 1,
        "stepType": "APPROVAL",
        "approverId": "approver-uuid",
        "approverName": "홍길동",
        "approverDepartmentId": "dept-uuid",
        "approverDepartmentName": "개발팀",
        "approverPositionId": "pos-uuid",
        "approverPositionTitle": "팀장",
        "assigneeRule": "FIXED",
        "status": "PENDING",
        "isRequired": true,
        "createdAt": "2024-01-01T00:00:00Z",
        "documentId": "document-uuid",
        "documentTitle": "휴가 신청서",
        "documentNumber": "DOC-2024-001",
        "drafterId": "drafter-uuid",
        "drafterName": "김철수",
        "drafterDepartmentName": "개발팀",
        "documentStatus": "PENDING",
        "submittedAt": "2024-01-01T00:00:00Z"
    }
]
```

**에러 응답**:

- `401 Unauthorized`: 인증 실패

**테스트 시나리오**:

- ✅ 정상: 내 결재 대기 목록 조회
- ✅ 정상: 기안자는 본인의 결재 대기 목록 (빈 배열 가능)
- ❌ 실패: 인증 토큰 없음 (401 반환)

---

## 7. 문서의 결재 단계 조회

특정 문서의 모든 결재 단계를 조회합니다.

**Endpoint**: `GET /api/approval-process/document/:documentId/steps`

**Path Parameters**:

| 파라미터     | 타입   | 설명    |
| ------------ | ------ | ------- |
| `documentId` | string | 문서 ID |

**Response 200 OK**:

```json
{
    "documentId": "document-uuid",
    "steps": [
        {
            "id": "step-snapshot-uuid-1",
            "snapshotId": "snapshot-uuid",
            "stepOrder": 1,
            "stepType": "AGREEMENT",
            "approverId": "approver-uuid-1",
            "approverName": "이협의",
            "approverDepartmentName": "회계팀",
            "assigneeRule": "FIXED",
            "status": "APPROVED",
            "comment": "검토 완료",
            "approvedAt": "2024-01-01T00:00:00Z",
            "isRequired": false
        },
        {
            "id": "step-snapshot-uuid-2",
            "snapshotId": "snapshot-uuid",
            "stepOrder": 2,
            "stepType": "APPROVAL",
            "approverId": "approver-uuid-2",
            "approverName": "홍길동",
            "approverDepartmentName": "개발팀",
            "assigneeRule": "FIXED",
            "status": "APPROVED",
            "comment": "승인합니다",
            "approvedAt": "2024-01-01T00:00:00Z",
            "isRequired": true
        },
        {
            "id": "step-snapshot-uuid-3",
            "snapshotId": "snapshot-uuid",
            "stepOrder": 3,
            "stepType": "APPROVAL",
            "approverId": "approver-uuid-3",
            "approverName": "김부장",
            "approverDepartmentName": "개발팀",
            "assigneeRule": "DRAFTER_SUPERIOR",
            "status": "PENDING",
            "isRequired": true
        },
        {
            "id": "step-snapshot-uuid-4",
            "snapshotId": "snapshot-uuid",
            "stepOrder": 4,
            "stepType": "IMPLEMENTATION",
            "approverId": "approver-uuid-4",
            "approverName": "박시행",
            "approverDepartmentName": "총무팀",
            "assigneeRule": "FIXED",
            "status": "PENDING",
            "isRequired": true
        }
    ],
    "totalSteps": 4,
    "completedSteps": 2
}
```

**에러 응답**:

- `401 Unauthorized`: 인증 실패
- `404 Not Found`: 문서를 찾을 수 없음

**테스트 시나리오**:

- ✅ 정상: 문서의 모든 결재 단계 조회
- ✅ 정상: 다른 사용자도 결재 단계 조회 가능
- ❌ 실패: 존재하지 않는 문서 ID (404 반환)
- ❌ 실패: 인증 토큰 없음 (401 반환)

---

## 공통 에러 응답

### 400 Bad Request

잘못된 요청입니다. 필수 파라미터 누락, 순서 위반 등이 원인입니다.

```json
{
    "statusCode": 400,
    "message": "이전 결재 단계가 완료되지 않았습니다",
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

권한이 없습니다. 해당 결재를 처리할 권한이 없는 사용자가 요청한 경우입니다.

```json
{
    "statusCode": 403,
    "message": "이 결재를 처리할 권한이 없습니다",
    "error": "Forbidden"
}
```

### 404 Not Found

요청한 리소스를 찾을 수 없습니다.

```json
{
    "statusCode": 404,
    "message": "결재 단계를 찾을 수 없습니다",
    "error": "Not Found"
}
```

---

## 주요 Enum 값

### ApprovalStepType (단계 유형)

- `AGREEMENT`: 협의
- `APPROVAL`: 결재
- `IMPLEMENTATION`: 시행
- `REFERENCE`: 참조

### ApprovalStatus (결재 상태)

- `PENDING`: 대기 중
- `APPROVED`: 승인
- `REJECTED`: 반려
- `CANCELLED`: 취소

---

## 결재 프로세스 흐름

### 1. 결재 진행 순서

```
[협의 단계] → [결재 단계 1] → [결재 단계 2] → ... → [시행 단계]
```

### 2. 각 단계별 처리 규칙

**협의 단계**:

- 순서 제약 없음
- 모든 협의자가 동시에 처리 가능
- 완료 여부가 결재 진행에 영향 없음 (단, 결재 전 모든 협의 완료 권장)

**결재 단계**:

- 순차 처리 (이전 결재 완료 후 다음 결재 가능)
- 협의가 있다면 모든 협의 완료 후 결재 가능
- 승인 또는 반려 가능

**시행 단계**:

- 모든 협의와 결재 완료 후 처리 가능
- 시행 결과 보고 및 데이터 저장

### 3. 결재 취소

- 기안자만 가능
- 진행 중인 결재를 취소 가능

---

## 테스트 시나리오

### 정상 시나리오

- ✅ 결재 승인 (의견 포함)
- ✅ 결재 승인 (의견 없음)
- ✅ 결재 반려 (사유 포함)
- ✅ 협의 완료
- ✅ 시행 완료
- ✅ 기안자가 결재 취소
- ✅ 내 결재 대기 목록 조회
- ✅ 문서의 결재 단계 조회

### 예외 시나리오

- ❌ 필수 필드 누락
- ❌ 존재하지 않는 stepSnapshotId (404 반환)
- ❌ 권한 없는 사용자가 승인/반려 시도 (403 반환)
- ❌ 이미 승인된 단계 재승인 시도 (400 반환)
- ❌ 협의 미완료 상태에서 결재 시도 (400 반환)
- ❌ 이전 결재 미완료 상태에서 다음 결재 시도 (400 반환)
- ❌ 기안자가 아닌 사용자가 취소 시도 (403 반환)
- ❌ 인증 토큰 없음 (401 반환)
