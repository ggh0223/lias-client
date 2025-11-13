# 결재 프로세스 API

## 기본 정보
- **Base URL**: `/approval-process`
- **인증**: JWT Bearer Token (현재 비활성화)
- **설명**: 결재 승인, 반려, 협의, 시행, 취소 등의 결재 프로세스를 처리하는 API

---

## 5.1 결재 승인

```http
POST /approval-process/approve
```

**Request Body**
```json
{
  "stepSnapshotId": "step-uuid-1",
  "comment": "승인합니다."
}
```

**필수 필드**
- `stepSnapshotId` (string UUID): 결재 단계 ID

**선택 필드**
- `comment` (string): 결재 의견

**응답 예시**
```json
{
  "id": "step-uuid-1",
  "stepOrder": 1,
  "stepType": "APPROVAL",
  "status": "APPROVED",
  "documentId": "doc-uuid-1",
  "approver": {
    "id": "emp-uuid-1",
    "name": "김철수",
    "employeeNumber": "E2023001"
  },
  "comment": "승인합니다.",
  "approvedAt": "2025-01-01T10:00:00.000Z"
}
```

**에러 응답**
- `404`: 결재 단계를 찾을 수 없음
- `400`: 대기 중인 결재만 승인 가능, 순서 검증 실패
- `403`: 권한 없음 (결재자가 아님)

---

## 5.2 결재 반려

```http
POST /approval-process/reject
```

**Request Body**
```json
{
  "stepSnapshotId": "step-uuid-1",
  "comment": "서류가 미비하여 반려합니다. 재제출 바랍니다."
}
```

**필수 필드**
- `stepSnapshotId` (string UUID): 결재 단계 ID
- `comment` (string): 반려 사유 (필수)

**응답 예시**
```json
{
  "id": "step-uuid-1",
  "stepOrder": 1,
  "stepType": "APPROVAL",
  "status": "REJECTED",
  "documentId": "doc-uuid-1",
  "approver": {
    "id": "emp-uuid-1",
    "name": "김철수",
    "employeeNumber": "E2023001"
  },
  "comment": "서류가 미비하여 반려합니다. 재제출 바랍니다.",
  "rejectedAt": "2025-01-01T10:00:00.000Z"
}
```

**에러 응답**
- `404`: 결재 단계를 찾을 수 없음
- `400`: 대기 중인 결재만 반려 가능, 반려 사유 누락
- `403`: 권한 없음

---

## 5.3 협의 완료

```http
POST /approval-process/complete-agreement
```

**Request Body**
```json
{
  "stepSnapshotId": "step-uuid-1",
  "comment": "검토 완료했습니다."
}
```

**필수 필드**
- `stepSnapshotId` (string UUID): 협의 단계 ID

**선택 필드**
- `comment` (string): 협의 의견

**응답 예시**
```json
{
  "id": "step-uuid-1",
  "stepOrder": 1,
  "stepType": "AGREEMENT",
  "status": "APPROVED",
  "documentId": "doc-uuid-1",
  "approver": {
    "id": "emp-uuid-1",
    "name": "김철수",
    "employeeNumber": "E2023001"
  },
  "comment": "검토 완료했습니다.",
  "approvedAt": "2025-01-01T09:00:00.000Z"
}
```

**에러 응답**
- `404`: 협의 단계를 찾을 수 없음
- `400`: 대기 중인 협의만 완료 가능
- `403`: 권한 없음

---

## 5.4 시행 완료

```http
POST /approval-process/complete-implementation
```

**Request Body**
```json
{
  "stepSnapshotId": "step-uuid-1",
  "comment": "처리 완료했습니다."
}
```

**필수 필드**
- `stepSnapshotId` (string UUID): 시행 단계 ID

**선택 필드**
- `comment` (string): 시행 의견

**참고**: 모든 결재가 완료되어야 시행 가능

**응답 예시**
```json
{
  "id": "step-uuid-1",
  "stepOrder": 3,
  "stepType": "IMPLEMENTATION",
  "status": "IMPLEMENTED",
  "documentId": "doc-uuid-1",
  "approver": {
    "id": "emp-uuid-1",
    "name": "김철수",
    "employeeNumber": "E2023001"
  },
  "comment": "처리 완료했습니다.",
  "implementedAt": "2025-01-01T15:00:00.000Z"
}
```

**에러 응답**
- `404`: 시행 단계를 찾을 수 없음
- `400`: 대기 중인 시행만 완료 가능, 모든 결재 미완료
- `403`: 권한 없음

---

## 5.5 결재 취소

```http
POST /approval-process/cancel
```

**Request Body**
```json
{
  "documentId": "doc-uuid-1",
  "reason": "내용 수정이 필요하여 취소합니다."
}
```

**필수 필드**
- `documentId` (string UUID): 문서 ID
- `reason` (string): 취소 사유

**참고**: 기안자만 취소 가능

**응답 예시**
```json
{
  "documentId": "doc-uuid-1",
  "status": "CANCELLED",
  "reason": "내용 수정이 필요하여 취소합니다.",
  "cancelledAt": "2025-01-01T11:00:00.000Z",
  "cancelledBy": {
    "id": "emp-uuid-1",
    "name": "김철수",
    "employeeNumber": "E2023001"
  }
}
```

**에러 응답**
- `404`: 문서를 찾을 수 없음
- `400`: 결재 진행 중인 문서만 취소 가능
- `403`: 기안자만 취소 가능

---

## 5.6 내 결재 대기 목록 조회

```http
GET /approval-process/my-pending
```

**Query Parameters**
| 파라미터 | 타입 | 필수 | 기본값 | 설명 |
|---------|------|------|--------|------|
| userId | string (UUID) | ✅ | - | 사용자 ID |
| type | enum | ✅ | - | 조회 타입 (SUBMITTED, AGREEMENT, APPROVAL) |
| page | number | ❌ | 1 | 페이지 번호 |
| limit | number | ❌ | 20 | 페이지당 항목 수 |

**조회 타입**
- `SUBMITTED`: 상신 (내가 기안한 문서들 중 결재 대기 중)
- `AGREEMENT`: 합의 (내가 합의해야 하는 문서들)
- `APPROVAL`: 미결 (내가 결재해야 하는 문서들)

**요청 예시**
```http
GET /approval-process/my-pending?userId=emp-uuid-1&type=APPROVAL&page=1&limit=10
GET /approval-process/my-pending?userId=emp-uuid-1&type=SUBMITTED
GET /approval-process/my-pending?userId=emp-uuid-1&type=AGREEMENT
```

**응답 예시**
```json
{
  "items": [
    {
      "documentId": "doc-uuid-1",
      "documentTitle": "2025년 1월 휴가 신청",
      "stepSnapshotId": "step-uuid-1",
      "stepType": "APPROVAL",
      "stepOrder": 1,
      "status": "PENDING",
      "drafter": {
        "id": "emp-uuid-drafter",
        "name": "이기안",
        "employeeNumber": "E2023100"
      },
      "submittedAt": "2025-01-01T08:00:00.000Z",
      "category": {
        "id": "cat-uuid-1",
        "name": "인사"
      }
    }
  ],
  "total": 15,
  "page": 1,
  "limit": 10,
  "totalPages": 2
}
```

---

## 5.7 문서의 결재 단계 목록 조회

```http
GET /approval-process/document/{documentId}/steps
```

**Path Parameters**
| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|------|------|
| documentId | string (UUID) | ✅ | 문서 ID |

**응답 예시**
```json
{
  "documentId": "doc-uuid-1",
  "documentTitle": "2025년 1월 휴가 신청",
  "documentStatus": "PENDING",
  "steps": [
    {
      "id": "step-uuid-1",
      "stepOrder": 1,
      "stepType": "APPROVAL",
      "status": "APPROVED",
      "approver": {
        "id": "emp-uuid-1",
        "name": "김철수",
        "employeeNumber": "E2023001",
        "email": "kim@example.com"
      },
      "comment": "승인합니다.",
      "approvedAt": "2025-01-01T10:00:00.000Z"
    },
    {
      "id": "step-uuid-2",
      "stepOrder": 2,
      "stepType": "APPROVAL",
      "status": "PENDING",
      "approver": {
        "id": "emp-uuid-2",
        "name": "이영희",
        "employeeNumber": "E2023002",
        "email": "lee@example.com"
      }
    },
    {
      "id": "step-uuid-3",
      "stepOrder": 3,
      "stepType": "IMPLEMENTATION",
      "status": "PENDING",
      "approver": {
        "id": "emp-uuid-3",
        "name": "박민수",
        "employeeNumber": "E2023003",
        "email": "park@example.com"
      }
    }
  ]
}
```

**에러 응답**
- `404`: 문서를 찾을 수 없음

---

## 5.8 통합 결재 액션 처리

```http
POST /approval-process/process-action
```

**Request Body**
```json
{
  "type": "APPROVE",
  "stepSnapshotId": "step-uuid-1",
  "documentId": "doc-uuid-1",
  "comment": "승인합니다.",
  "reason": null
}
```

**필수 필드**
- `type` (enum): 액션 타입
  - `APPROVE`: 승인
  - `REJECT`: 반려
  - `COMPLETE_AGREEMENT`: 협의 완료
  - `COMPLETE_IMPLEMENTATION`: 시행 완료
  - `CANCEL`: 취소

**타입별 필수 필드**
- `APPROVE`, `REJECT`, `COMPLETE_AGREEMENT`, `COMPLETE_IMPLEMENTATION`: `stepSnapshotId` 필요
- `CANCEL`: `documentId`, `reason` 필요
- `REJECT`, `CANCEL`: `comment` 또는 `reason` 필수

**응답 예시**
```json
{
  "id": "step-uuid-1",
  "stepType": "APPROVAL",
  "status": "APPROVED",
  "documentId": "doc-uuid-1",
  "approver": {
    "id": "emp-uuid-1",
    "name": "김철수"
  },
  "comment": "승인합니다.",
  "processedAt": "2025-01-01T12:00:00.000Z"
}
```

**에러 응답**
- `400`: 필수 필드 누락, 잘못된 타입
- `403`: 권한 없음
- `404`: 결재 단계 또는 문서를 찾을 수 없음

---

## 📌 결재 프로세스 흐름

### 기본 흐름
```
1. 문서 기안
   ↓
2. 협의 (선택)
   - 모든 협의자가 협의 완료
   ↓
3. 결재
   - 순차적으로 결재자들이 승인
   - 한 명이라도 반려하면 전체 반려
   ↓
4. 시행
   - 모든 결재 완료 후 시행 가능
   - 시행자가 처리 완료
   ↓
5. 참조
   - 시행 완료 시 참조자들에게 알림
```

### 예외 케이스
- **반려**: 결재 중 반려 시 문서 상태가 `REJECTED`로 변경
- **취소**: 기안자가 결재 진행 중 취소 가능 (`CANCELLED`)

---

## 📌 권한 규칙

| 액션 | 수행 가능자 | 조건 |
|------|------------|------|
| 결재 승인 | 해당 단계의 결재자 | 대기 중인 단계, 순서대로 진행 |
| 결재 반려 | 해당 단계의 결재자 | 대기 중인 단계 |
| 협의 완료 | 해당 단계의 협의자 | 대기 중인 단계 |
| 시행 완료 | 해당 단계의 시행자 | 모든 결재 완료 후 |
| 결재 취소 | 기안자 | 결재 진행 중 |

---

## 📌 참고

- 결재는 순서대로 진행되어야 합니다 (`stepOrder`).
- 협의는 모든 협의자가 완료해야 다음 단계로 진행됩니다.
- 반려 시 반려 사유(`comment`)는 필수입니다.
- 시행은 모든 결재가 완료된 후에만 가능합니다.

