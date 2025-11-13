# 문서 관리 API

## 기본 정보
- **Base URL**: `/documents`
- **인증**: JWT Bearer Token (현재 비활성화)
- **설명**: 문서 생성, 조회, 수정, 삭제 및 기안을 처리하는 API

---

## 4.1 문서 생성 (임시저장)

```http
POST /documents
```

**Request Body**
```json
{
  "documentTemplateId": "tpl-uuid-1",
  "title": "2025년 1월 휴가 신청",
  "content": "<p>휴가 사유: 개인 사유</p><p>기간: 2025-01-15 ~ 2025-01-17</p>",
  "drafterId": "emp-uuid-1",
  "metadata": {
    "startDate": "2025-01-15",
    "endDate": "2025-01-17",
    "vacationType": "연차",
    "days": 3
  },
  "approvalSteps": [
    {
      "stepOrder": 1,
      "stepType": "APPROVAL",
      "approverId": "emp-uuid-manager"
    },
    {
      "stepOrder": 2,
      "stepType": "IMPLEMENTATION",
      "approverId": "emp-uuid-hr"
    }
  ]
}
```

**필수 필드**
- `title` (string): 문서 제목
- `content` (string): 문서 내용 (HTML)
- `drafterId` (string UUID): 기안자 ID

**선택 필드**
- `documentTemplateId` (string UUID): 템플릿 ID
- `metadata` (object): 추가 메타데이터
- `approvalSteps` (array): 결재단계 (임시저장 시 미리 설정 가능)

**응답 예시 (201 Created)**
```json
{
  "id": "doc-uuid-1",
  "title": "2025년 1월 휴가 신청",
  "content": "<p>휴가 사유: 개인 사유</p>...",
  "status": "DRAFT",
  "documentTemplateId": "tpl-uuid-1",
  "drafterId": "emp-uuid-1",
  "drafter": {
    "id": "emp-uuid-1",
    "name": "김철수",
    "employeeNumber": "E2023001"
  },
  "metadata": {...},
  "createdAt": "2025-01-01T00:00:00.000Z"
}
```

**에러 응답**
- `400`: 필수 필드 누락
- `404`: 존재하지 않는 템플릿 또는 기안자
- `401`: 인증 실패

---

## 4.2 문서 목록 조회

```http
GET /documents
```

**Query Parameters**
| 파라미터 | 타입 | 필수 | 기본값 | 설명 |
|---------|------|------|--------|------|
| status | enum | ❌ | - | 문서 상태 (DRAFT, PENDING, APPROVED, REJECTED, CANCELLED, IMPLEMENTED) |
| pendingStepType | enum | ❌ | - | PENDING 상태 세분화 (AGREEMENT, APPROVAL, IMPLEMENTATION) |
| drafterId | string (UUID) | ❌ | - | 기안자 ID로 필터링 |
| categoryId | string (UUID) | ❌ | - | 카테고리 ID로 필터링 |
| searchKeyword | string | ❌ | - | 제목 검색 |
| startDate | string (ISO 8601) | ❌ | - | 시작 날짜 |
| endDate | string (ISO 8601) | ❌ | - | 종료 날짜 |
| page | number | ❌ | 1 | 페이지 번호 |
| limit | number | ❌ | 20 | 페이지당 항목 수 |

**요청 예시**
```http
GET /documents
GET /documents?status=PENDING
GET /documents?status=PENDING&pendingStepType=APPROVAL
GET /documents?drafterId=emp-uuid-1&page=1&limit=10
GET /documents?searchKeyword=휴가&categoryId=cat-uuid-1
```

**응답 예시**
```json
{
  "items": [
    {
      "id": "doc-uuid-1",
      "title": "2025년 1월 휴가 신청",
      "status": "PENDING",
      "currentStepType": "APPROVAL",
      "drafter": {
        "id": "emp-uuid-1",
        "name": "김철수",
        "employeeNumber": "E2023001"
      },
      "category": {
        "id": "cat-uuid-1",
        "name": "인사"
      },
      "createdAt": "2025-01-01T00:00:00.000Z",
      "submittedAt": "2025-01-01T01:00:00.000Z"
    }
  ],
  "total": 45,
  "page": 1,
  "limit": 20,
  "totalPages": 3
}
```

---

## 4.3 문서 상세 조회

```http
GET /documents/{documentId}
```

**Path Parameters**
| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|------|------|
| documentId | string (UUID) | ✅ | 문서 ID |

**응답 예시**
```json
{
  "id": "doc-uuid-1",
  "title": "2025년 1월 휴가 신청",
  "content": "<p>휴가 사유: 개인 사유</p>...",
  "status": "PENDING",
  "documentTemplate": {
    "id": "tpl-uuid-1",
    "name": "휴가 신청서",
    "code": "VACATION_REQUEST"
  },
  "drafter": {
    "id": "emp-uuid-1",
    "name": "김철수",
    "employeeNumber": "E2023001",
    "email": "kim@example.com"
  },
  "category": {
    "id": "cat-uuid-1",
    "name": "인사"
  },
  "metadata": {
    "startDate": "2025-01-15",
    "endDate": "2025-01-17",
    "vacationType": "연차",
    "days": 3
  },
  "createdAt": "2025-01-01T00:00:00.000Z",
  "submittedAt": "2025-01-01T01:00:00.000Z",
  "approvalSteps": [
    {
      "id": "step-uuid-1",
      "stepOrder": 1,
      "stepType": "APPROVAL",
      "status": "APPROVED",
      "approver": {
        "id": "emp-uuid-manager",
        "name": "이영희",
        "employeeNumber": "E2023002"
      },
      "approvedAt": "2025-01-01T02:00:00.000Z",
      "comment": "승인합니다."
    },
    {
      "id": "step-uuid-2",
      "stepOrder": 2,
      "stepType": "APPROVAL",
      "status": "PENDING",
      "approver": {
        "id": "emp-uuid-director",
        "name": "박민수",
        "employeeNumber": "E2023003"
      }
    }
  ]
}
```

**에러 응답**
- `404`: 문서를 찾을 수 없음

---

## 4.4 문서 수정

```http
PUT /documents/{documentId}
```

**Path Parameters**
| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|------|------|
| documentId | string (UUID) | ✅ | 문서 ID |

**Request Body** (모든 필드 선택)
```json
{
  "title": "2025년 1월 휴가 신청 (수정)",
  "content": "<p>휴가 사유: 가족 행사</p>...",
  "metadata": {
    "startDate": "2025-01-15",
    "endDate": "2025-01-18",
    "days": 4
  },
  "approvalSteps": [
    {
      "id": "step-uuid-1",
      "stepOrder": 1,
      "stepType": "APPROVAL",
      "approverId": "emp-uuid-new-manager"
    }
  ]
}
```

**참고**: 임시저장(DRAFT) 상태의 문서만 수정 가능

**응답 예시**
```json
{
  "id": "doc-uuid-1",
  "title": "2025년 1월 휴가 신청 (수정)",
  "content": "<p>휴가 사유: 가족 행사</p>...",
  "status": "DRAFT",
  "updatedAt": "2025-01-01T03:00:00.000Z"
}
```

**에러 응답**
- `404`: 문서를 찾을 수 없음
- `400`: 임시저장 상태가 아님

---

## 4.5 문서 삭제

```http
DELETE /documents/{documentId}
```

**Path Parameters**
| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|------|------|
| documentId | string (UUID) | ✅ | 문서 ID |

**참고**: 임시저장(DRAFT) 상태의 문서만 삭제 가능

**응답** (204 No Content)
- Body 없음

**에러 응답**
- `404`: 문서를 찾을 수 없음
- `400`: 임시저장 상태가 아님

---

## 4.6 문서 기안

```http
POST /documents/{documentId}/submit
```

**Path Parameters**
| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|------|------|
| documentId | string (UUID) | ✅ | 기안할 문서 ID |

**Request Body** (모든 필드 선택)
```json
{
  "documentTemplateId": "tpl-uuid-1",
  "approvalSteps": [
    {
      "stepOrder": 1,
      "stepType": "APPROVAL",
      "approverId": "emp-uuid-manager"
    },
    {
      "stepOrder": 2,
      "stepType": "IMPLEMENTATION",
      "approverId": "emp-uuid-hr"
    }
  ]
}
```

**참고**
- 결재 단계는 최소 1개의 APPROVAL + 1개의 IMPLEMENTATION 필요
- 기안 시점에 결재선을 지정하거나 기존 스냅샷 사용 가능

**응답 예시**
```json
{
  "id": "doc-uuid-1",
  "title": "2025년 1월 휴가 신청",
  "status": "PENDING",
  "submittedAt": "2025-01-01T04:00:00.000Z",
  "approvalSteps": [
    {
      "id": "step-uuid-1",
      "stepOrder": 1,
      "stepType": "APPROVAL",
      "status": "PENDING",
      "approver": {
        "id": "emp-uuid-manager",
        "name": "이영희"
      }
    }
  ]
}
```

**에러 응답**
- `404`: 문서를 찾을 수 없음
- `400`: 임시저장 상태가 아니거나 결재선이 유효하지 않음

---

## 4.7 바로 기안

```http
POST /documents/submit-direct
```

**Request Body**
```json
{
  "documentTemplateId": "tpl-uuid-1",
  "title": "2025년 1월 휴가 신청",
  "content": "<p>휴가 사유: 개인 사유</p>...",
  "drafterId": "emp-uuid-1",
  "metadata": {
    "startDate": "2025-01-15",
    "endDate": "2025-01-17"
  }
}
```

**참고**
- 임시저장 단계를 건너뛰고 바로 기안
- 내부적으로 임시저장 후 기안하는 방식으로 처리
- 템플릿의 결재선이 자동으로 계산되어 적용됨

**응답 예시 (201 Created)**
```json
{
  "id": "doc-uuid-1",
  "title": "2025년 1월 휴가 신청",
  "status": "PENDING",
  "submittedAt": "2025-01-01T05:00:00.000Z"
}
```

**에러 응답**
- `400`: 필수 필드 누락
- `404`: 템플릿 또는 기안자를 찾을 수 없음

---

## 4.8 새 문서 작성용 템플릿 상세 조회

```http
GET /documents/templates/{templateId}
```

**Path Parameters**
| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|------|------|
| templateId | string (UUID) | ✅ | 템플릿 ID |

**Query Parameters**
| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|------|------|
| drafterId | string (UUID) | ✅ | 기안자 ID |

**요청 예시**
```http
GET /documents/templates/tpl-uuid-1?drafterId=emp-uuid-1
```

**설명**
- AssigneeRule을 기반으로 실제 적용될 결재자 정보가 맵핑되어 반환
- 기안자의 부서장, 상급자 등이 자동으로 계산됨

**응답 예시**
```json
{
  "id": "tpl-uuid-1",
  "name": "휴가 신청서",
  "code": "VACATION_REQUEST",
  "template": "<html>...</html>",
  "approvalSteps": [
    {
      "stepOrder": 1,
      "stepType": "APPROVAL",
      "assigneeRule": "DEPARTMENT_HEAD",
      "mappedApprovers": [
        {
          "employeeId": "emp-uuid-dept-head",
          "employeeNumber": "E2023010",
          "name": "최부서장",
          "email": "choi@example.com",
          "type": "DEPARTMENT_HEAD"
        }
      ]
    },
    {
      "stepOrder": 2,
      "stepType": "IMPLEMENTATION",
      "assigneeRule": "SPECIFIC_EMPLOYEE",
      "mappedApprovers": [
        {
          "employeeId": "emp-uuid-hr",
          "employeeNumber": "E2023020",
          "name": "정인사",
          "email": "jung@example.com",
          "type": "FIXED"
        }
      ]
    }
  ]
}
```

**에러 응답**
- `404`: 템플릿 또는 기안자를 찾을 수 없음
- `400`: 기안자의 부서/직책 정보 없음

---

## 📌 문서 상태 흐름

```
DRAFT (임시저장)
  ↓ submitDocument
PENDING (결재 진행 중)
  ↓ approveStep (모든 결재 승인 시)
APPROVED (승인 완료)
  ↓ completeImplementation
IMPLEMENTED (시행 완료)

PENDING 또는 APPROVED
  ↓ rejectStep
REJECTED (반려)

PENDING
  ↓ cancelApproval
CANCELLED (취소)
```

---

## 📌 참고

- 임시저장 상태에서만 수정/삭제 가능합니다.
- 기안 후에는 결재 프로세스를 통해서만 상태 변경이 가능합니다.
- 페이징은 기본 20개 단위로 제공됩니다.

