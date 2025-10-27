# Approval Flow API 문서

## 개요

Approval Flow API는 결재 흐름 관리 시스템의 핵심 기능을 제공합니다.

- 문서양식 및 결재선 생성/수정
- 결재선 템플릿 복제 및 버전 관리
- 기안 시 결재 스냅샷 생성
- 결재선 미리보기

**Base URL**: `/api/approval-flow`

**인증**: 모든 엔드포인트는 `Bearer Token` 인증이 필요합니다.

---

## API 엔드포인트 목록

### 생성 API

1. [문서양식 생성 & 결재선 연결](#1-문서양식-생성--결재선-연결)
2. [새로운 결재선 템플릿 생성](#2-새로운-결재선-템플릿-생성)
3. [결재선 템플릿 복제 (Detach & Clone)](#3-결재선-템플릿-복제-detach--clone)
4. [결재 스냅샷 생성 (기안 시 호출)](#4-결재-스냅샷-생성-기안-시-호출)

### 수정 API

5. [문서양식 수정 (새 버전 생성)](#5-문서양식-수정-새-버전-생성)
6. [결재선 템플릿 새 버전 생성](#6-결재선-템플릿-새-버전-생성)

### 조회 API

7. [결재선 템플릿 목록 조회](#7-결재선-템플릿-목록-조회)
8. [결재선 템플릿 상세 조회](#8-결재선-템플릿-상세-조회)
9. [결재선 템플릿 버전 상세 조회](#9-결재선-템플릿-버전-상세-조회)
10. [문서양식 목록 조회](#10-문서양식-목록-조회)
11. [문서양식 상세 조회](#11-문서양식-상세-조회)
12. [문서양식 버전 상세 조회](#12-문서양식-버전-상세-조회)

### 미리보기 API

13. [결재선 미리보기](#13-결재선-미리보기)

---

## 1. 문서양식 생성 & 결재선 연결

문서양식을 생성하고 결재선을 연결합니다.
기존 결재선을 참조하거나 복제 후 수정할 수 있습니다.

**Endpoint**: `POST /api/approval-flow/forms`

**Request Body**:

```json
{
  "formName": "휴가 신청서",
  "formCode": "VACATION_REQUEST",
  "description": "연차/반차 신청용",
  "template": "<h1>휴가 신청서</h1><p>신청 내용: </p>",
  "useExistingLine": false,
  "baseLineTemplateVersionId": "template-version-uuid",
  "stepEdits": [
    {
      "stepOrder": 1,
      "stepType": "APPROVAL",
      "assigneeRule": "FIXED",
      "targetEmployeeId": "emp-uuid-123",
      "isRequired": true
    },
    {
      "stepOrder": 2,
      "stepType": "APPROVAL",
      "assigneeRule": "DRAFTER_SUPERIOR",
      "isRequired": true
    }
  ]
}
```

**필드 설명**:

| 필드                        | 타입    | 필수 | 설명                                                              |
| --------------------------- | ------- | ---- | ----------------------------------------------------------------- |
| `formName`                  | string  | ✅   | 문서양식 이름                                                     |
| `formCode`                  | string  | ✅   | 문서양식 코드                                                     |
| `description`               | string  | ❌   | 문서양식 설명                                                     |
| `template`                  | string  | ❌   | 문서양식 HTML 템플릿                                              |
| `useExistingLine`           | boolean | ❌   | 기존 결재선 사용 여부                                             |
| `lineTemplateVersionId`     | string  | ❌   | 기존 결재선 템플릿 버전 ID (useExistingLine=true 시 필수)         |
| `baseLineTemplateVersionId` | string  | ❌   | 복제할 기준 결재선 템플릿 버전 ID (useExistingLine=false 시 필수) |
| `stepEdits`                 | array   | ❌   | 단계 수정 정보 (useExistingLine=false 시 사용)                    |

**stepEdits 필드**:

| 필드                 | 타입    | 필수 | 설명                                                                      |
| -------------------- | ------- | ---- | ------------------------------------------------------------------------- |
| `stepOrder`          | number  | ✅   | 단계 순서                                                                 |
| `stepType`           | enum    | ✅   | 단계 유형 (AGREEMENT, APPROVAL, IMPLEMENTATION, REFERENCE)                |
| `assigneeRule`       | enum    | ✅   | 담당자 지정 규칙 (FIXED, DRAFTER, DRAFTER_SUPERIOR, DEPARTMENT_REFERENCE) |
| `targetDepartmentId` | string  | ❌   | 대상 부서 ID (DEPARTMENT_REFERENCE인 경우)                                |
| `targetPositionId`   | string  | ❌   | 대상 직책 ID (POSITION_BASED인 경우)                                      |
| `targetEmployeeId`   | string  | ❌   | 대상 직원 ID (고정 담당자, FIXED인 경우 필수)                             |
| `isRequired`         | boolean | ✅   | 필수 여부                                                                 |

**Response 201 Created**:

```json
{
  "form": {
    "id": "form-uuid",
    "name": "휴가 신청서",
    "code": "VACATION_REQUEST",
    "description": "연차/반차 신청용",
    "status": "ACTIVE",
    "currentVersionId": "version-uuid",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  },
  "formVersion": {
    "id": "version-uuid",
    "formId": "form-uuid",
    "versionNo": 1,
    "isActive": true,
    "changeReason": null,
    "createdAt": "2024-01-01T00:00:00Z"
  },
  "lineTemplateVersionId": "template-version-uuid"
}
```

**에러 응답**:

- `400 Bad Request`: 잘못된 요청 (필수 파라미터 누락 등)
- `401 Unauthorized`: 인증 실패
- `404 Not Found`: 존재하지 않는 결재선 템플릿 버전 ID

---

## 2. 새로운 결재선 템플릿 생성

완전히 새로운 결재선 템플릿을 생성합니다.
템플릿 생성 시 첫 번째 버전(v1)이 자동으로 생성됩니다.

**Endpoint**: `POST /api/approval-flow/templates`

**Request Body**:

```json
{
  "name": "일반 결재선",
  "description": "부서 내 일반적인 결재 프로세스",
  "type": "COMMON",
  "orgScope": "COMPANY",
  "steps": [
    {
      "stepOrder": 1,
      "stepType": "AGREEMENT",
      "assigneeRule": "FIXED",
      "targetEmployeeId": "emp-uuid-123",
      "isRequired": false
    },
    {
      "stepOrder": 2,
      "stepType": "APPROVAL",
      "assigneeRule": "DRAFTER_SUPERIOR",
      "isRequired": true
    },
    {
      "stepOrder": 3,
      "stepType": "APPROVAL",
      "assigneeRule": "FIXED",
      "targetEmployeeId": "emp-uuid-456",
      "isRequired": true
    }
  ]
}
```

**필드 설명**:

| 필드           | 타입   | 필수 | 설명                                             |
| -------------- | ------ | ---- | ------------------------------------------------ |
| `name`         | string | ✅   | 결재선 템플릿 이름                               |
| `description`  | string | ❌   | 결재선 템플릿 설명                               |
| `type`         | enum   | ✅   | 결재선 유형 (COMMON: 공통, DEDICATED: 전용)      |
| `orgScope`     | enum   | ✅   | 조직 범위 (COMPANY: 전사, DEPARTMENT: 부서별)    |
| `departmentId` | string | ❌   | 대상 부서 ID (orgScope가 DEPARTMENT인 경우 필수) |
| `steps`        | array  | ✅   | 결재 단계 목록 (최소 1개)                        |

**Response 201 Created**:

```json
{
  "id": "template-uuid",
  "name": "일반 결재선",
  "description": "부서 내 일반적인 결재 프로세스",
  "type": "COMMON",
  "orgScope": "COMPANY",
  "departmentId": null,
  "status": "ACTIVE",
  "currentVersionId": "version-uuid",
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

**에러 응답**:

- `400 Bad Request`: 잘못된 요청 (필수 파라미터 누락, steps 빈 배열 등)
- `401 Unauthorized`: 인증 실패

---

## 3. 결재선 템플릿 복제 (Detach & Clone)

기존 결재선 템플릿을 복제합니다.
newTemplateName이 있으면 새 템플릿을 생성(분기)하고, 없으면 원본 템플릿에 새 버전을 추가합니다.

**Endpoint**: `POST /api/approval-flow/templates/clone`

**Request Body**:

```json
{
  "baseTemplateVersionId": "template-version-uuid",
  "newTemplateName": "지출결의 전용 결재선",
  "stepEdits": [
    {
      "stepOrder": 1,
      "stepType": "APPROVAL",
      "assigneeRule": "FIXED",
      "targetEmployeeId": "emp-uuid-789",
      "isRequired": true
    }
  ]
}
```

**필드 설명**:

| 필드                    | 타입   | 필수 | 설명                                               |
| ----------------------- | ------ | ---- | -------------------------------------------------- |
| `baseTemplateVersionId` | string | ✅   | 복제할 기준 결재선 템플릿 버전 ID                  |
| `newTemplateName`       | string | ❌   | 새 템플릿 이름 (없으면 원본 템플릿에 새 버전 추가) |
| `stepEdits`             | array  | ❌   | 단계 수정 정보                                     |

**Response 201 Created**:

```json
{
  "id": "new-version-uuid",
  "templateId": "template-uuid",
  "versionNo": 2,
  "isActive": true,
  "changeReason": null,
  "createdAt": "2024-01-01T00:00:00Z"
}
```

**에러 응답**:

- `400 Bad Request`: 잘못된 요청 (필수 파라미터 누락)
- `401 Unauthorized`: 인증 실패
- `404 Not Found`: 원본 결재선 템플릿을 찾을 수 없음

---

## 4. 결재 스냅샷 생성 (기안 시 호출)

문서 기안 시 호출됩니다.
결재선 템플릿의 assignee_rule을 기안 컨텍스트로 해석하여 실제 결재자를 확정하고 스냅샷으로 저장합니다.

**Endpoint**: `POST /api/approval-flow/snapshots`

**Request Body**:

```json
{
  "documentId": "document-uuid",
  "formVersionId": "form-version-uuid",
  "draftContext": {
    "drafterId": "employee-uuid",
    "drafterDepartmentId": "dept-uuid",
    "documentAmount": 1000000,
    "documentType": "EXPENSE"
  }
}
```

**필드 설명**:

| 필드            | 타입   | 필수 | 설명               |
| --------------- | ------ | ---- | ------------------ |
| `documentId`    | string | ✅   | 문서 ID            |
| `formVersionId` | string | ✅   | 문서양식 버전 ID   |
| `draftContext`  | object | ✅   | 기안 컨텍스트 정보 |

**draftContext 필드**:

| 필드                  | 타입   | 필수 | 설명                           |
| --------------------- | ------ | ---- | ------------------------------ |
| `drafterId`           | string | ✅   | 기안자 ID                      |
| `drafterDepartmentId` | string | ❌   | 기안자 부서 ID                 |
| `documentAmount`      | number | ❌   | 문서 금액 (금액 기반 결재선용) |
| `documentType`        | string | ❌   | 문서 유형                      |
| `customFields`        | object | ❌   | 추가 컨텍스트 정보             |

**AssigneeRule 해석 규칙**:

- `FIXED`: 고정 결재자 (defaultApproverId 사용)
- `DRAFTER`: 기안자 본인
- `DRAFTER_SUPERIOR`: 기안자의 상급자
- `DEPARTMENT_HEAD`: 지정된 부서의 부서장
- `POSITION_BASED`: 지정된 직책의 담당자

**Response 201 Created**:

```json
{
  "id": "snapshot-uuid",
  "documentId": "document-uuid",
  "frozenAt": "2024-01-01T00:00:00Z",
  "steps": [
    {
      "id": "step-snapshot-uuid",
      "stepOrder": 1,
      "stepType": "APPROVAL",
      "approverId": "approver-uuid",
      "approverDepartmentId": "dept-uuid",
      "approverPositionId": "pos-uuid",
      "required": true,
      "status": "PENDING"
    }
  ]
}
```

**에러 응답**:

- `400 Bad Request`: 결재자를 찾을 수 없음 (assignee_rule 해석 실패)
- `404 Not Found`: 문서양식 버전을 찾을 수 없음

**참고**: 이 API는 주로 문서 제출(`POST /api/document/v2/documents/:documentId/submit`) 프로세스 내에서 내부적으로 호출됩니다.

---

## 5. 문서양식 수정 (새 버전 생성)

문서양식을 수정합니다.
기존 버전은 불변으로 유지하고 새 버전을 생성합니다.

**Endpoint**: `PATCH /api/approval-flow/forms/:formId/versions`

**Path Parameters**:

| 파라미터 | 타입   | 설명        |
| -------- | ------ | ----------- |
| `formId` | string | 문서양식 ID |

**Request Body**:

```json
{
  "versionNote": "결재선 수정",
  "template": "<h1>휴가 신청서 v2</h1><p>신청 내용: </p>",
  "cloneAndEdit": true,
  "baseLineTemplateVersionId": "template-version-uuid",
  "stepEdits": [
    {
      "stepOrder": 2,
      "stepType": "APPROVAL",
      "assigneeRule": "FIXED",
      "targetEmployeeId": "emp-uuid-999",
      "isRequired": true
    }
  ]
}
```

**필드 설명**:

| 필드                        | 타입    | 필수 | 설명                                                     |
| --------------------------- | ------- | ---- | -------------------------------------------------------- |
| `formId`                    | string  | ❌   | 문서양식 ID (검증용, 선택사항)                           |
| `versionNote`               | string  | ❌   | 버전 변경 사유                                           |
| `template`                  | string  | ❌   | 문서양식 템플릿 (HTML)                                   |
| `lineTemplateVersionId`     | string  | ❌   | 결재선 템플릿 버전 ID (결재선 변경 시)                   |
| `cloneAndEdit`              | boolean | ❌   | 복제 후 수정 여부                                        |
| `baseLineTemplateVersionId` | string  | ❌   | 복제할 기준 결재선 템플릿 버전 ID (cloneAndEdit=true 시) |
| `stepEdits`                 | array   | ❌   | 단계 수정 정보 (cloneAndEdit=true 시 사용)               |

**Response 200 OK**:

```json
{
  "form": {
    "id": "form-uuid",
    "name": "휴가 신청서",
    "code": "VACATION_REQUEST",
    "description": "연차/반차 신청용",
    "status": "ACTIVE",
    "currentVersionId": "new-version-uuid",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  },
  "newVersion": {
    "id": "new-version-uuid",
    "formId": "form-uuid",
    "versionNo": 2,
    "isActive": true,
    "changeReason": "결재선 수정",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

**에러 응답**:

- `400 Bad Request`: URL의 formId와 body의 formId가 일치하지 않음
- `401 Unauthorized`: 인증 실패
- `404 Not Found`: 문서양식을 찾을 수 없음

---

## 6. 결재선 템플릿 새 버전 생성

기존 결재선 템플릿의 새 버전을 생성합니다.
기존 버전은 비활성화되고 새 버전이 활성화됩니다.

**Endpoint**: `POST /api/approval-flow/templates/:templateId/versions`

**Path Parameters**:

| 파라미터     | 타입   | 설명             |
| ------------ | ------ | ---------------- |
| `templateId` | string | 결재선 템플릿 ID |

**Request Body**:

```json
{
  "versionNote": "단계 추가",
  "steps": [
    {
      "stepOrder": 1,
      "stepType": "AGREEMENT",
      "assigneeRule": "FIXED",
      "targetEmployeeId": "emp-uuid-123",
      "isRequired": false
    },
    {
      "stepOrder": 2,
      "stepType": "APPROVAL",
      "assigneeRule": "DRAFTER_SUPERIOR",
      "isRequired": true
    },
    {
      "stepOrder": 3,
      "stepType": "APPROVAL",
      "assigneeRule": "FIXED",
      "targetEmployeeId": "emp-uuid-456",
      "isRequired": true
    }
  ]
}
```

**필드 설명**:

| 필드          | 타입   | 필수 | 설명                                |
| ------------- | ------ | ---- | ----------------------------------- |
| `templateId`  | string | ❌   | 결재선 템플릿 ID (검증용, 선택사항) |
| `versionNote` | string | ❌   | 버전 변경 사유                      |
| `steps`       | array  | ✅   | 결재 단계 목록 (최소 1개)           |

**Response 201 Created**:

```json
{
  "id": "new-version-uuid",
  "templateId": "template-uuid",
  "versionNo": 2,
  "isActive": true,
  "changeReason": "단계 추가",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

**에러 응답**:

- `400 Bad Request`: URL의 templateId와 body의 templateId가 일치하지 않음
- `401 Unauthorized`: 인증 실패
- `404 Not Found`: 결재선 템플릿을 찾을 수 없음

---

## 7. 결재선 템플릿 목록 조회

등록된 결재선 템플릿 목록을 조회합니다.

**Endpoint**: `GET /api/approval-flow/templates`

**Query Parameters**:

| 파라미터 | 타입   | 필수 | 설명                               |
| -------- | ------ | ---- | ---------------------------------- |
| `type`   | string | ❌   | 템플릿 유형 (COMMON, DEDICATED 등) |

**Response 200 OK**:

```json
[
  {
    "id": "template-uuid",
    "name": "일반 결재선",
    "description": "부서 내 일반적인 결재 프로세스",
    "type": "COMMON",
    "orgScope": "COMPANY",
    "departmentId": null,
    "status": "ACTIVE",
    "currentVersionId": "version-uuid",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
]
```

**에러 응답**:

- `401 Unauthorized`: 인증 실패

---

## 8. 결재선 템플릿 상세 조회

특정 결재선 템플릿의 상세 정보를 조회합니다.

**Endpoint**: `GET /api/approval-flow/templates/:templateId`

**Path Parameters**:

| 파라미터     | 타입   | 설명             |
| ------------ | ------ | ---------------- |
| `templateId` | string | 결재선 템플릿 ID |

**Response 200 OK**:

```json
{
  "id": "template-uuid",
  "name": "일반 결재선",
  "description": "부서 내 일반적인 결재 프로세스",
  "type": "COMMON",
  "orgScope": "COMPANY",
  "departmentId": null,
  "status": "ACTIVE",
  "currentVersionId": "version-uuid",
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z",
  "versions": [
    {
      "id": "version-uuid",
      "versionNo": 1,
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

**에러 응답**:

- `401 Unauthorized`: 인증 실패
- `404 Not Found`: 결재선 템플릿을 찾을 수 없음

---

## 9. 결재선 템플릿 버전 상세 조회

특정 결재선 템플릿의 특정 버전 상세 정보를 조회합니다. step 정보와 직원/부서 정보가 포함됩니다.

**Endpoint**: `GET /api/approval-flow/templates/:templateId/versions/:versionId`

**Path Parameters**:

| 파라미터     | 타입   | 설명                  |
| ------------ | ------ | --------------------- |
| `templateId` | string | 결재선 템플릿 ID      |
| `versionId`  | string | 결재선 템플릿 버전 ID |

**Response 200 OK**:

```json
{
  "id": "version-uuid",
  "templateId": "template-uuid",
  "versionNo": 1,
  "isActive": true,
  "changeReason": null,
  "createdAt": "2024-01-01T00:00:00Z",
  "steps": [
    {
      "id": "step-uuid",
      "lineTemplateVersionId": "version-uuid",
      "stepOrder": 1,
      "stepType": "AGREEMENT",
      "assigneeRule": "FIXED",
      "defaultApproverId": "emp-uuid-123",
      "targetDepartmentId": null,
      "targetPositionId": null,
      "required": false,
      "description": null,
      "defaultApprover": {
        "id": "emp-uuid-123",
        "employeeNumber": "EMP001",
        "name": "홍길동",
        "email": "hong@company.com",
        "phoneNumber": "010-1234-5678"
      },
      "targetDepartment": null,
      "targetPosition": null
    },
    {
      "id": "step-uuid-2",
      "lineTemplateVersionId": "version-uuid",
      "stepOrder": 2,
      "stepType": "APPROVAL",
      "assigneeRule": "DRAFTER_SUPERIOR",
      "defaultApproverId": null,
      "targetDepartmentId": "dept-uuid",
      "targetPositionId": null,
      "required": true,
      "description": "부서장 승인",
      "defaultApprover": null,
      "targetDepartment": {
        "id": "dept-uuid",
        "departmentCode": "IT001",
        "departmentName": "개발본부"
      },
      "targetPosition": null
    }
  ]
}
```

**Step 정보 필드 설명**:

| 필드                    | 타입    | 설명                                   |
| ----------------------- | ------- | -------------------------------------- |
| `id`                    | string  | 결재 단계 템플릿 ID                    |
| `lineTemplateVersionId` | string  | 결재선 템플릿 버전 ID                  |
| `stepOrder`             | number  | 단계 순서                              |
| `stepType`              | enum    | 단계 유형                              |
| `assigneeRule`          | enum    | 결재자 할당 규칙                       |
| `defaultApproverId`     | string  | 고정 결재자 ID (FIXED인 경우)          |
| `targetDepartmentId`    | string  | 대상 부서 ID                           |
| `targetPositionId`      | string  | 대상 직책 ID                           |
| `required`              | boolean | 필수 여부                              |
| `description`           | string  | 설명                                   |
| `defaultApprover`       | object  | 고정 결재자 정보 (직원 ID가 있을 때만) |
| `targetDepartment`      | object  | 대상 부서 정보 (부서 ID가 있을 때만)   |
| `targetPosition`        | object  | 대상 직책 정보 (직책 ID가 있을 때만)   |

**고정 결재자 정보** (`defaultApprover`):

| 필드             | 타입   | 설명     |
| ---------------- | ------ | -------- |
| `id`             | string | 직원 ID  |
| `employeeNumber` | string | 직원번호 |
| `name`           | string | 이름     |
| `email`          | string | 이메일   |
| `phoneNumber`    | string | 전화번호 |

**대상 부서 정보** (`targetDepartment`):

| 필드             | 타입   | 설명      |
| ---------------- | ------ | --------- |
| `id`             | string | 부서 ID   |
| `departmentCode` | string | 부서 코드 |
| `departmentName` | string | 부서명    |

**대상 직책 정보** (`targetPosition`):

| 필드                     | 타입    | 설명                |
| ------------------------ | ------- | ------------------- |
| `id`                     | string  | 직책 ID             |
| `positionCode`           | string  | 직책 코드           |
| `positionTitle`          | string  | 직책명              |
| `level`                  | number  | 직책 레벨           |
| `hasManagementAuthority` | boolean | 관리 권한 보유 여부 |

**에러 응답**:

- `401 Unauthorized`: 인증 실패
- `404 Not Found`: 결재선 템플릿 버전을 찾을 수 없음

---

## 10. 문서양식 목록 조회

등록된 문서양식 목록을 조회합니다.

**Endpoint**: `GET /api/approval-flow/forms`

**Response 200 OK**:

```json
[
  {
    "id": "form-uuid",
    "name": "휴가 신청서",
    "code": "VACATION_REQUEST",
    "description": "연차/반차 신청용",
    "status": "ACTIVE",
    "currentVersionId": "version-uuid",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
]
```

**에러 응답**:

- `401 Unauthorized`: 인증 실패

---

## 11. 문서양식 상세 조회

특정 문서양식의 상세 정보를 조회합니다.

**Endpoint**: `GET /api/approval-flow/forms/:formId`

**Path Parameters**:

| 파라미터 | 타입   | 설명        |
| -------- | ------ | ----------- |
| `formId` | string | 문서양식 ID |

**Response 200 OK**:

```json
{
  "id": "form-uuid",
  "name": "휴가 신청서",
  "code": "VACATION_REQUEST",
  "description": "연차/반차 신청용",
  "status": "ACTIVE",
  "currentVersionId": "version-uuid",
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z",
  "versions": [
    {
      "id": "version-uuid",
      "versionNo": 1,
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "linkedLineTemplate": {
    "id": "template-uuid",
    "name": "일반 결재선",
    "currentVersionId": "template-version-uuid"
  }
}
```

**에러 응답**:

- `401 Unauthorized`: 인증 실패
- `404 Not Found`: 문서양식을 찾을 수 없음

---

## 12. 문서양식 버전 상세 조회

특정 문서양식의 특정 버전 상세 정보를 조회합니다. 결재선 정보와 직원/부서 정보가 포함됩니다.

**Endpoint**: `GET /api/approval-flow/forms/:formId/versions/:versionId`

**Path Parameters**:

| 파라미터    | 타입   | 설명             |
| ----------- | ------ | ---------------- |
| `formId`    | string | 문서양식 ID      |
| `versionId` | string | 문서양식 버전 ID |

**Response 200 OK**:

```json
{
  "id": "version-uuid",
  "formId": "form-uuid",
  "versionNo": 1,
  "isActive": true,
  "changeReason": null,
  "createdAt": "2024-01-01T00:00:00Z",
  "template": "<h1>휴가 신청서</h1><p>신청 내용: </p>",
  "approvalLineInfo": {
    "template": {
      "id": "template-uuid",
      "name": "일반 결재선",
      "type": "COMMON",
      "orgScope": "COMPANY"
    },
    "templateVersion": {
      "id": "template-version-uuid",
      "templateId": "template-uuid",
      "versionNo": 1,
      "isActive": true,
      "changeReason": null,
      "createdAt": "2024-01-01T00:00:00Z"
    },
    "steps": [
      {
        "id": "step-uuid",
        "lineTemplateVersionId": "template-version-uuid",
        "stepOrder": 1,
        "stepType": "AGREEMENT",
        "assigneeRule": "FIXED",
        "defaultApproverId": "emp-uuid-123",
        "targetDepartmentId": null,
        "targetPositionId": null,
        "required": false,
        "description": null,
        "defaultApprover": {
          "id": "emp-uuid-123",
          "employeeNumber": "EMP001",
          "name": "홍길동",
          "email": "hong@company.com",
          "phoneNumber": "010-1234-5678"
        },
        "targetDepartment": null,
        "targetPosition": null
      },
      {
        "id": "step-uuid-2",
        "lineTemplateVersionId": "template-version-uuid",
        "stepOrder": 2,
        "stepType": "APPROVAL",
        "assigneeRule": "DRAFTER_SUPERIOR",
        "defaultApproverId": null,
        "targetDepartmentId": "dept-uuid",
        "targetPositionId": null,
        "required": true,
        "description": "부서장 승인",
        "defaultApprover": null,
        "targetDepartment": {
          "id": "dept-uuid",
          "departmentCode": "IT001",
          "departmentName": "개발본부"
        },
        "targetPosition": null
      }
    ]
  }
}
```

**필드 설명**:

| 필드               | 타입    | 설명                 |
| ------------------ | ------- | -------------------- |
| `id`               | string  | 문서양식 버전 ID     |
| `formId`           | string  | 문서양식 ID          |
| `versionNo`        | number  | 버전 번호            |
| `isActive`         | boolean | 활성 여부            |
| `changeReason`     | string  | 변경 사유            |
| `createdAt`        | Date    | 생성일시             |
| `template`         | string  | 문서양식 HTML 템플릿 |
| `approvalLineInfo` | object  | 연결된 결재선 정보   |

**approvalLineInfo 필드**:

| 필드              | 타입   | 설명                                 |
| ----------------- | ------ | ------------------------------------ |
| `template`        | object | 결재선 템플릿 정보                   |
| `templateVersion` | object | 결재선 템플릿 버전 정보              |
| `steps`           | array  | 결재 단계 목록 (직원/부서 정보 포함) |

**Step 정보**는 [결재선 템플릿 버전 상세 조회](#9-결재선-템플릿-버전-상세-조회)의 Step 정보 필드 설명과 동일합니다.

**에러 응답**:

- `401 Unauthorized`: 인증 실패
- `404 Not Found`: 문서양식 버전을 찾을 수 없음

---

## 13. 결재선 미리보기

문서 작성 시 실제로 할당될 결재자 목록을 미리 확인합니다.
문서양식에 연결된 결재선 템플릿과 기안 컨텍스트를 기반으로 실제 결재자(이름, 부서, 직책)를 조회합니다.

**Endpoint**: `POST /api/approval-flow/forms/:formId/preview-approval-line`

**Path Parameters**:

| 파라미터 | 타입   | 설명        |
| -------- | ------ | ----------- |
| `formId` | string | 문서양식 ID |

**Request Body**:

```json
{
  "formVersionId": "version-uuid",
  "drafterDepartmentId": "dept-uuid",
  "documentAmount": 1000000,
  "documentType": "EXPENSE"
}
```

**필드 설명**:

| 필드                  | 타입          | 필수 | 설명                                                  |
| --------------------- | ------------- | ---- | ----------------------------------------------------- |
| `formVersionId`       | string (UUID) | ✅   | 문서양식 버전 ID                                      |
| `drafterDepartmentId` | string (UUID) | ❌   | 기안 부서 ID (미입력시 직원의 주 소속 부서 자동 사용) |
| `documentAmount`      | number        | ❌   | 문서 금액 (금액 기반 결재선용)                        |
| `documentType`        | string        | ❌   | 문서 유형                                             |

**Response 200 OK**:

```json
{
  "templateName": "일반 결재선",
  "templateDescription": "부서 내 일반적인 결재 프로세스",
  "steps": [
    {
      "stepOrder": 1,
      "stepType": "AGREEMENT",
      "isRequired": false,
      "employeeId": "emp-uuid-123",
      "employeeName": "홍길동",
      "departmentName": "개발팀",
      "positionTitle": "팀원",
      "assigneeRule": "FIXED"
    },
    {
      "stepOrder": 2,
      "stepType": "APPROVAL",
      "isRequired": true,
      "employeeId": "emp-uuid-456",
      "employeeName": "김부장",
      "departmentName": "개발팀",
      "positionTitle": "부장",
      "assigneeRule": "DRAFTER_SUPERIOR"
    }
  ]
}
```

**에러 응답**:

- `400 Bad Request`: 잘못된 요청 (기안자 부서 정보 없음 등)
- `401 Unauthorized`: 인증 실패
- `404 Not Found`: 문서양식 또는 결재선 템플릿을 찾을 수 없음

---

## 공통 에러 응답

### 400 Bad Request

잘못된 요청입니다. 필수 파라미터 누락, 유효하지 않은 데이터 등이 원인입니다.

```json
{
  "statusCode": 400,
  "message": "필수 필드가 누락되었습니다",
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
  "message": "문서양식을 찾을 수 없습니다",
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

### AssigneeRule (담당자 지정 규칙)

- `FIXED`: 고정 결재자
- `DRAFTER`: 기안자
- `DRAFTER_SUPERIOR`: 기안자의 상급자
- `DEPARTMENT_REFERENCE`: 부서 전체 참조

### ApprovalLineType (결재선 유형)

- `COMMON`: 공통
- `DEDICATED`: 전용

### DepartmentScopeType (조직 범위)

- `COMPANY`: 전사
- `DEPARTMENT`: 부서별

---

## 결재 프로세스 흐름

### 1. 문서양식 및 결재선 설정

1. 결재선 템플릿 생성 (`POST /api/approval-flow/templates`)
2. 문서양식 생성 및 결재선 연결 (`POST /api/approval-flow/forms`)

### 2. 문서 기안

1. 결재선 미리보기 (`POST /api/approval-flow/forms/:formId/preview-approval-line`)
2. 문서 제출 시 자동으로 결재 스냅샷 생성 (`POST /api/approval-flow/snapshots`)

### 3. 결재 프로세스

- 결재는 독립 문서와 연결된 스냅샷을 기반으로 진행됩니다
- 결재선 템플릿이 변경되어도 기안된 문서의 결재선은 변경되지 않습니다

---

## 테스트 시나리오

### 정상 시나리오

- ✅ 복제 후 수정 방식으로 문서양식 생성
- ✅ 기존 결재선 참조하여 문서양식 생성
- ✅ 문서양식 템플릿 수정 (새 버전 생성)
- ✅ 결재선도 함께 변경
- ✅ 같은 템플릿의 새 버전으로 복제
- ✅ 새로운 템플릿으로 분기
- ✅ 다양한 assigneeRule로 스냅샷 생성
- ✅ 결재선 미리보기 조회

### 예외 시나리오

- ❌ 필수 필드 누락 (formName, formCode)
- ❌ useExistingLine=true인데 lineTemplateVersionId 누락
- ❌ useExistingLine=false인데 baseLineTemplateVersionId 누락
- ❌ 존재하지 않는 결재선 템플릿 버전 ID (404 반환)
- ❌ steps가 빈 배열 (400 반환)
- ❌ 존재하지 않는 문서양식 ID (404 반환)
