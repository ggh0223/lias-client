# LIAS 결재 시스템 API 문서 (v2)

본 문서는 LIAS 결재 시스템 v2의 REST API 엔드포인트를 정리한 문서입니다.

## 🔐 인증

모든 API는 JWT 토큰 기반 인증을 사용합니다.

### 요청 헤더

```
Authorization: Bearer <JWT_TOKEN>
```

### JWT 페이로드

```typescript
{
  "employeeNumber": string;  // 직원 번호
  "iat": number;            // 발급 시간
  "exp": number;            // 만료 시간
}
```

**참고:** JWT 토큰을 통해 사용자 정보가 자동으로 추출되므로, 대부분의 API에서 `drafterId`, `approverId` 등의 사용자 ID를 Request Body에 포함할 필요가 없습니다.

---

## 📌 목차

1. [Approval Flow API](#1-approval-flow-api) - 결재 흐름 설정
2. [Document API](#2-document-api) - 문서 관리
3. [Approval Process API](#3-approval-process-api) - 결재 프로세스 실행

---

## 1. Approval Flow API

**Base Path:** `/api/v2/approval-flow`

결재 흐름 관련 API로, 문서양식과 결재선 템플릿을 생성하고 관리합니다.

### 1.1 문서양식 생성 & 결재선 연결

새로운 문서양식을 생성하고 결재선을 연결합니다.

- **Method:** `POST`
- **Endpoint:** `/forms`
- **Status Code:** `201 Created`

#### Request Body

```typescript
{
  "formName": string;          // 문서양식 이름
  "description"?: string;      // 설명
  "template"?: string;         // 템플릿 내용 (HTML)

  // 결재선 설정
  "useExistingLine": boolean;  // true: 기존 결재선 참조, false: 복제 후 수정
  "lineTemplateVersionId"?: string;  // 참조할 결재선 템플릿 버전 ID

  // 결재선 복제 시
  "baseLineTemplateVersionId"?: string;  // 복제할 원본 결재선 템플릿 버전 ID
  "stepEdits"?: Array<{        // 단계별 수정 사항
    stepOrder: number;
    stepType: 'AGREEMENT' | 'APPROVAL' | 'IMPLEMENTATION' | 'REFERENCE';
    assigneeRule: 'FIXED' | 'DRAFTER' | 'DEPARTMENT_HEAD' | 'POSITION_BASED' | 'DOCUMENT_FIELD';
    defaultApproverId?: string;
    targetDepartmentId?: string;
    targetPositionId?: string;
    required: boolean;
  }>
}
```

#### Response

```typescript
{
  "form": {
    "id": string;
    "name": string;
    "description": string;
    "status": 'ACTIVE' | 'INACTIVE';
    "currentVersionId": string;
    "createdAt": Date;
    "updatedAt": Date;
  },
  "formVersion": {
    "id": string;
    "formId": string;
    "versionNo": number;
    "template": string;
    "isActive": boolean;
  },
  "lineTemplateVersionId": string;
}
```

#### Response Codes

- `201`: 문서양식 생성 성공
- `400`: 잘못된 요청 (필수 파라미터 누락 등)
- `401`: 인증 실패

---

### 1.2 문서양식 수정 (새 버전 생성)

문서양식을 수정합니다. 기존 버전은 불변으로 유지하고 새 버전을 생성합니다.

- **Method:** `PATCH`
- **Endpoint:** `/forms/:formId/versions`
- **Status Code:** `200 OK`

#### Path Parameters

- `formId` (string, required): 문서양식 ID

#### Request Body

```typescript
{
  "template"?: string;         // 새 템플릿 내용
  "versionNote"?: string;      // 버전 변경 사유

  // 결재선 변경 시
  "lineTemplateVersionId"?: string;
  "cloneAndEdit"?: boolean;
  "baseLineTemplateVersionId"?: string;
  "stepEdits"?: Array<{
    stepOrder: number;
    stepType: 'AGREEMENT' | 'APPROVAL' | 'IMPLEMENTATION' | 'REFERENCE';
    assigneeRule: 'FIXED' | 'DRAFTER' | 'DEPARTMENT_HEAD' | 'POSITION_BASED' | 'DOCUMENT_FIELD';
    defaultApproverId?: string;
    targetDepartmentId?: string;
    targetPositionId?: string;
    required: boolean;
    description?: string;
  }>
}
```

#### Response

```typescript
{
  "form": {
    "id": string;
    "name": string;
    "description": string;
    "status": 'ACTIVE' | 'INACTIVE';
    "currentVersionId": string;
    "createdAt": Date;
    "updatedAt": Date;
  },
  "newVersion": {
    "id": string;
    "formId": string;
    "versionNo": number;
    "template": string;
    "isActive": boolean;
    "createdAt": Date;
    "updatedAt": Date;
  }
}
```

#### Response Codes

- `200`: 문서양식 수정 성공
- `404`: 문서양식을 찾을 수 없음
- `401`: 인증 실패

---

### 1.3 결재선 템플릿 복제

기존 결재선 템플릿을 복제합니다.

- **Method:** `POST`
- **Endpoint:** `/templates/clone`
- **Status Code:** `201 Created`

#### Request Body

```typescript
{
  "baseTemplateVersionId": string;  // 복제할 원본 템플릿 버전 ID
  "newTemplateName"?: string;       // 새 템플릿 이름 (제공 시 새 템플릿 생성)
  "newTemplateDescription"?: string;
  "stepEdits"?: Array<{
    stepOrder: number;
    stepType: string;
    assigneeRule: string;
    defaultApproverId?: string;
    targetDepartmentId?: string;
    targetPositionId?: string;
    required: boolean;
    description?: string;
  }>
}
```

#### Response

```typescript
{
  "id": string;
  "templateId": string;
  "versionNo": number;
  "isActive": boolean;
  "createdAt": Date;
  "updatedAt": Date;
}
```

#### Response Codes

- `201`: 결재선 템플릿 복제 성공
- `404`: 원본 결재선 템플릿을 찾을 수 없음
- `401`: 인증 실패

---

### 1.4 결재선 템플릿 생성

완전히 새로운 결재선 템플릿을 생성합니다.

- **Method:** `POST`
- **Endpoint:** `/templates`
- **Status Code:** `201 Created`

#### Request Body

```typescript
{
  "name": string;                    // 템플릿 이름
  "description"?: string;            // 템플릿 설명
  "type": 'COMMON' | 'CUSTOM';       // 템플릿 유형
  "orgScope": 'ALL' | 'SPECIFIC_DEPARTMENT';  // 조직 범위
  "departmentId"?: string;           // 대상 부서 ID (orgScope가 SPECIFIC_DEPARTMENT인 경우)
  "steps": Array<{
    stepOrder: number;
    stepType: 'AGREEMENT' | 'APPROVAL' | 'IMPLEMENTATION' | 'REFERENCE';
    assigneeRule: 'FIXED' | 'DRAFTER' | 'DRAFTER_SUPERIOR' | 'DEPARTMENT_HEAD' | 'POSITION_BASED' | 'RANK_BASED';
    targetDepartmentId?: string;
    targetPositionId?: string;
    targetEmployeeId?: string;       // 고정 담당자 ID (assigneeRule이 FIXED인 경우)
    isRequired: boolean;
  }>
}
```

#### Response

```typescript
{
  "id": string;
  "name": string;
  "description"?: string;
  "type": 'COMMON' | 'CUSTOM';
  "orgScope": 'ALL' | 'SPECIFIC_DEPARTMENT';
  "departmentId"?: string;
  "status": 'DRAFT' | 'ACTIVE' | 'ARCHIVED';
  "currentVersionId": string;
  "createdAt": Date;
  "updatedAt": Date;
}
```

#### Response Codes

- `201`: 결재선 템플릿 생성 성공
- `400`: 잘못된 요청 (필수 파라미터 누락 등)
- `401`: 인증 실패

---

### 1.5 결재선 템플릿 새 버전 생성

기존 결재선 템플릿의 새 버전을 생성합니다.

- **Method:** `POST`
- **Endpoint:** `/templates/:templateId/versions`
- **Status Code:** `201 Created`

#### Path Parameters

- `templateId` (string, required): 결재선 템플릿 ID

#### Request Body

```typescript
{
  "name": string;
  "description"?: string;
  "steps": Array<{
    stepOrder: number;
    stepType: 'AGREEMENT' | 'APPROVAL' | 'IMPLEMENTATION' | 'REFERENCE';
    assigneeRule: 'FIXED' | 'DRAFTER' | 'DEPARTMENT_HEAD' | 'POSITION_BASED' | 'DOCUMENT_FIELD';
    defaultApproverId?: string;
    targetDepartmentId?: string;
    targetPositionId?: string;
    required: boolean;
    description?: string;
  }>
}
```

#### Response

```typescript
{
  "id": string;
  "templateId": string;
  "versionNo": number;
  "isActive": boolean;
  "createdAt": Date;
  "updatedAt": Date;
}
```

#### Response Codes

- `201`: 새 버전 생성 성공
- `404`: 결재선 템플릿을 찾을 수 없음
- `401`: 인증 실패

---

### 1.5 결재 스냅샷 생성

문서 기안 시 호출되며, 결재선 템플릿의 assignee_rule을 기안 컨텍스트로 해석하여 실제 결재자를 확정합니다.

- **Method:** `POST`
- **Endpoint:** `/snapshots`
- **Status Code:** `201 Created`

#### Request Body

```typescript
{
  "documentId": string;
  "formVersionId": string;
  "draftContext": {
    "drafterId": string;         // 기안자 ID
    "drafterDepartmentId": string;  // 기안 부서 ID
    "lineTemplateVersionId": string;  // 결재선 템플릿 버전 ID
    "documentAmount"?: number;   // 문서 금액 (조건부 결재자 판단용)
    "documentType"?: string;     // 문서 유형
  }
}
```

#### Response

```typescript
{
  "id": string;  // 스냅샷 ID
  "documentId": string;
  "sourceTemplateVersionId": string;
  "snapshotName": string;
  "snapshotDescription": string;
  "frozenAt": Date;
  "steps": Array<{
    "id": string;
    "stepOrder": number;
    "stepType": string;
    "approverId": string;
    "approverDepartmentId": string;
    "approverPositionId": string;
    "status": 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED';
    "isRequired": boolean;
  }>
}
```

#### Response Codes

- `201`: 결재 스냅샷 생성 성공
- `404`: 문서양식 버전을 찾을 수 없음
- `400`: 결재자를 찾을 수 없음 (assignee_rule 해석 실패)

---

## 2. Document API

**Base Path:** `/api/v2/document`

문서의 생명주기를 관리하는 API입니다.

### 2.1 문서 생성

새로운 문서를 생성합니다 (임시저장 상태).

- **Method:** `POST`
- **Endpoint:** `/`
- **Status Code:** `201 Created`

#### Request Body

```typescript
{
  "formVersionId": string;  // 문서 양식 버전 ID
  "title": string;          // 문서 제목
  "content": string;        // 문서 내용 (HTML)
  "metadata"?: Record<string, any>;  // 추가 메타데이터
}
```

**참고:** `drafterId`는 JWT 토큰에서 자동으로 추출됩니다.

#### Response

```typescript
{
  "id": string;
  "formVersionId": string;
  "title": string;
  "drafterId": string;
  "status": 'DRAFT';  // 임시저장 상태
  "content": string;
  "metadata"?: Record<string, any>;
  "documentNumber": string;
  "createdAt": Date;
  "updatedAt": Date;
}
```

#### Response Codes

- `201`: 문서 생성 성공
- `400`: 잘못된 요청
- `401`: 인증 실패
- `404`: 양식을 찾을 수 없음

---

### 2.2 문서 수정

임시저장 상태의 문서를 수정합니다.

- **Method:** `PUT`
- **Endpoint:** `/:documentId`
- **Status Code:** `200 OK`

#### Path Parameters

- `documentId` (string, required): 문서 ID

#### Request Body

```typescript
{
  "title"?: string;
  "content"?: string;
  "metadata"?: Record<string, any>;
}
```

#### Response

```typescript
{
  "id": string;
  "formVersionId": string;
  "title": string;
  "drafterId": string;
  "status": 'DRAFT';
  "content": string;
  "metadata"?: Record<string, any>;
  "updatedAt": Date;
}
```

#### Response Codes

- `200`: 문서 수정 성공
- `400`: 잘못된 요청 (임시저장 상태가 아닌 문서는 수정 불가)
- `401`: 인증 실패
- `404`: 문서를 찾을 수 없음

---

### 2.3 문서 제출

문서를 결재선에 제출합니다.

- **Method:** `POST`
- **Endpoint:** `/:documentId/submit`
- **Status Code:** `200 OK`

#### Path Parameters

- `documentId` (string, required): 문서 ID

#### Request Body

```typescript
{
  "draftContext": {
    "drafterDepartmentId": string;
    "lineTemplateVersionId": string;  // 사용할 결재선 템플릿 버전 ID
    "documentAmount"?: number;
    "documentType"?: string;
  }
}
```

**참고:** `drafterId`는 JWT 토큰에서 자동으로 추출됩니다.

#### Response

```typescript
{
  "id": string;
  "formVersionId": string;
  "title": string;
  "drafterId": string;
  "status": 'PENDING';  // 결재 대기 상태로 변경
  "content": string;
  "approvalLineSnapshotId": string;  // 생성된 결재선 스냅샷 ID
  "submittedAt": Date;
  "updatedAt": Date;
}
```

#### Response Codes

- `200`: 문서 제출 성공
- `400`: 잘못된 요청
- `401`: 인증 실패
- `404`: 문서 또는 결재선 템플릿을 찾을 수 없음

---

### 2.4 문서 삭제

임시저장 상태의 문서를 삭제합니다.

- **Method:** `DELETE`
- **Endpoint:** `/:documentId`
- **Status Code:** `200 OK`

#### Path Parameters

- `documentId` (string, required): 문서 ID

#### Response

```typescript
{
  "success": true,
  "message": "문서가 삭제되었습니다."
}
```

#### Response Codes

- `200`: 문서 삭제 성공
- `400`: 잘못된 요청 (임시저장 상태가 아닌 문서는 삭제 불가)
- `401`: 인증 실패
- `404`: 문서를 찾을 수 없음

---

### 2.5 문서 조회 (ID)

ID로 문서를 조회합니다.

- **Method:** `GET`
- **Endpoint:** `/:documentId`
- **Status Code:** `200 OK`

#### Path Parameters

- `documentId` (string, required): 문서 ID

#### Response

```typescript
{
  "id": string;
  "formVersionId": string;
  "title": string;
  "drafterId": string;
  "status": 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED' | 'IMPLEMENTED';
  "content": string;
  "metadata"?: Record<string, any>;
  "documentNumber": string;
  "approvalLineSnapshotId"?: string;
  "submittedAt"?: Date;
  "cancelReason"?: string;
  "cancelledAt"?: Date;
  "createdAt": Date;
  "updatedAt": Date;
}
```

#### Response Codes

- `200`: 문서 조회 성공
- `401`: 인증 실패
- `404`: 문서를 찾을 수 없음

---

### 2.6 내 문서 조회

내가 작성한 모든 문서를 조회합니다.

- **Method:** `GET`
- **Endpoint:** `/my-documents`
- **Status Code:** `200 OK`

**참고:** 기안자 ID는 JWT 토큰에서 자동으로 추출됩니다.

#### Response

```typescript
Array<{
  id: string;
  formVersionId: string;
  title: string;
  drafterId: string;
  drafterDepartmentId?: string;
  status:
    | "DRAFT"
    | "PENDING"
    | "APPROVED"
    | "REJECTED"
    | "CANCELLED"
    | "IMPLEMENTED";
  content?: string;
  metadata?: Record<string, any>;
  documentNumber: string;
  approvalLineSnapshotId?: string;
  submittedAt?: Date;
  cancelReason?: string;
  cancelledAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}>;
```

#### Response Codes

- `200`: 문서 목록 조회 성공
- `401`: 인증 실패

---

### 2.7 상태별 문서 조회

특정 상태의 모든 문서를 조회합니다.

- **Method:** `GET`
- **Endpoint:** `/status/:status`
- **Status Code:** `200 OK`

#### Path Parameters

- `status` (enum, required): 문서 상태
  - `DRAFT`: 임시저장
  - `PENDING`: 결재 대기
  - `APPROVED`: 승인 완료
  - `REJECTED`: 반려
  - `CANCELLED`: 취소
  - `IMPLEMENTED`: 시행 완료

#### Response

```typescript
Array<{
  id: string;
  formVersionId: string;
  title: string;
  drafterId: string;
  drafterDepartmentId?: string;
  status:
    | "DRAFT"
    | "PENDING"
    | "APPROVED"
    | "REJECTED"
    | "CANCELLED"
    | "IMPLEMENTED";
  content?: string;
  metadata?: Record<string, any>;
  documentNumber: string;
  approvalLineSnapshotId?: string;
  submittedAt?: Date;
  cancelReason?: string;
  cancelledAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}>;
```

#### Response Codes

- `200`: 문서 목록 조회 성공
- `401`: 인증 실패

---

## 3. Approval Process API

**Base Path:** `/api/v2/approval-process`

결재 프로세스 실행과 관련된 API입니다.

### 3.1 결재 승인

결재 단계를 승인합니다.

- **Method:** `POST`
- **Endpoint:** `/approve`
- **Status Code:** `200 OK`

#### Request Body

```typescript
{
  "stepSnapshotId": string;  // 결재 단계 스냅샷 ID
  "comment"?: string;        // 결재 의견
}
```

**참고:** `approverId`는 JWT 토큰에서 자동으로 추출됩니다.

#### Response

```typescript
{
  "id": string;
  "snapshotId": string;
  "stepOrder": number;
  "stepType": 'APPROVAL';
  "approverId": string;
  "status": 'APPROVED';
  "comment"?: string;
  "approvedAt": Date;
}
```

#### Response Codes

- `200`: 결재 승인 성공
- `400`: 잘못된 요청
- `401`: 인증 실패
- `403`: 권한 없음
- `404`: 결재 단계를 찾을 수 없음

---

### 3.2 결재 반려

결재 단계를 반려합니다.

- **Method:** `POST`
- **Endpoint:** `/reject`
- **Status Code:** `200 OK`

#### Request Body

```typescript
{
  "stepSnapshotId": string;  // 결재 단계 스냅샷 ID
  "comment": string;         // 반려 사유 (필수)
}
```

**참고:** `approverId`는 JWT 토큰에서 자동으로 추출됩니다.

#### Response

```typescript
{
  "id": string;
  "snapshotId": string;
  "stepOrder": number;
  "stepType": 'APPROVAL';
  "approverId": string;
  "status": 'REJECTED';
  "comment": string;  // 반려 사유
  "rejectedAt": Date;
}
```

#### Response Codes

- `200`: 결재 반려 성공
- `400`: 잘못된 요청 (반려 사유 필수)
- `401`: 인증 실패
- `403`: 권한 없음
- `404`: 결재 단계를 찾을 수 없음

---

### 3.3 협의 완료

협의 단계를 완료 처리합니다.

- **Method:** `POST`
- **Endpoint:** `/agreement/complete`
- **Status Code:** `200 OK`

#### Request Body

```typescript
{
  "stepSnapshotId": string;  // 협의 단계 스냅샷 ID
  "comment"?: string;        // 협의 의견
}
```

**참고:** `agreerId`는 JWT 토큰에서 자동으로 추출됩니다.

#### Response

```typescript
{
  "id": string;
  "snapshotId": string;
  "stepOrder": number;
  "stepType": 'AGREEMENT';
  "approverId": string;
  "status": 'COMPLETED';
  "comment"?: string;
  "completedAt": Date;
}
```

#### Response Codes

- `200`: 협의 완료 성공
- `400`: 잘못된 요청
- `401`: 인증 실패
- `403`: 권한 없음
- `404`: 협의 단계를 찾을 수 없음

---

### 3.4 시행 완료

시행 단계를 완료 처리합니다.

- **Method:** `POST`
- **Endpoint:** `/implementation/complete`
- **Status Code:** `200 OK`

#### Request Body

```typescript
{
  "stepSnapshotId": string;     // 시행 단계 스냅샷 ID
  "comment"?: string;           // 시행 결과
  "resultData"?: any;           // 시행 결과 데이터
}
```

**참고:** `implementerId`는 JWT 토큰에서 자동으로 추출됩니다.

#### Response

```typescript
{
  "id": string;
  "snapshotId": string;
  "stepOrder": number;
  "stepType": 'IMPLEMENTATION';
  "approverId": string;
  "status": 'COMPLETED';
  "comment"?: string;
  "completedAt": Date;
}
```

#### Response Codes

- `200`: 시행 완료 성공
- `400`: 잘못된 요청
- `401`: 인증 실패
- `403`: 권한 없음
- `404`: 시행 단계를 찾을 수 없음

---

### 3.5 결재 취소

문서 결재를 취소합니다 (기안자만 가능).

- **Method:** `POST`
- **Endpoint:** `/cancel`
- **Status Code:** `200 OK`

#### Request Body

```typescript
{
  "documentId": string;      // 문서 ID
  "reason": string;          // 취소 사유
}
```

**참고:** `drafterId`는 JWT 토큰에서 자동으로 추출되어 권한 확인에 사용됩니다.

#### Response

```typescript
{
  "success": true,
  "message": "결재가 취소되었습니다."
}
```

#### Response Codes

- `200`: 결재 취소 성공
- `400`: 잘못된 요청
- `401`: 인증 실패
- `403`: 권한 없음 (기안자가 아닌 경우)
- `404`: 문서를 찾을 수 없음

---

### 3.6 내 결재 대기 목록

나에게 할당된 결재 대기 건을 조회합니다.

- **Method:** `GET`
- **Endpoint:** `/my-pending`
- **Status Code:** `200 OK`

**참고:** 결재자 ID는 JWT 토큰에서 자동으로 추출됩니다.

#### Response

```typescript
Array<{
  id: string;
  snapshotId: string;
  stepOrder: number;
  stepType: "AGREEMENT" | "APPROVAL" | "IMPLEMENTATION";
  approverId: string;
  approverDepartmentId?: string;
  approverPositionId?: string;
  status: "PENDING";
  isRequired: boolean;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}>;
```

#### Response Codes

- `200`: 결재 대기 목록 조회 성공
- `401`: 인증 실패

---

### 3.7 문서의 결재 단계 조회

특정 문서의 모든 결재 단계를 조회합니다.

- **Method:** `GET`
- **Endpoint:** `/document/:documentId/steps`
- **Status Code:** `200 OK`

#### Path Parameters

- `documentId` (string, required): 문서 ID

#### Response

```typescript
{
  "documentId": string;
  "documentStatus": 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED' | 'IMPLEMENTED';
  "approvalLineSnapshotId": string;
  "steps": Array<{
    "id": string;
    "stepOrder": number;
    "stepType": 'AGREEMENT' | 'APPROVAL' | 'IMPLEMENTATION' | 'REFERENCE';
    "approverId": string;
    "approverName": string;
    "approverDepartmentName": string;
    "status": 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED';
    "isRequired": boolean;
    "comment"?: string;
    "approvedAt"?: Date;
    "rejectedAt"?: Date;
    "completedAt"?: Date;
  }>;
}
```

#### Response Codes

- `200`: 결재 단계 조회 성공
- `401`: 인증 실패
- `404`: 문서를 찾을 수 없음

---

## 📊 상태 흐름도

### 문서 상태 전환

```
DRAFT (임시저장)
  ↓ [제출]
PENDING (결재 대기)
  ↓ [결재 승인]
APPROVED (승인 완료)
  ↓ [시행 완료]
IMPLEMENTED (시행 완료)

또는

PENDING (결재 대기)
  ↓ [반려]
REJECTED (반려)

또는

PENDING (결재 대기)
  ↓ [취소]
CANCELLED (취소)
```

### 결재 단계 상태 전환

```
PENDING (대기)
  ↓ [승인/완료]
APPROVED / COMPLETED (승인/완료)

또는

PENDING (대기)
  ↓ [반려]
REJECTED (반려)
```

---

## 🔐 권한 정책

### 역할별 권한

| 역할       | 가능한 작업                                                        |
| ---------- | ------------------------------------------------------------------ |
| **기안자** | - 문서 생성/수정/삭제 (DRAFT 상태만)<br>- 문서 제출<br>- 결재 취소 |
| **협의자** | - 협의 완료 처리<br>- 협의 의견 작성                               |
| **결재자** | - 결재 승인/반려<br>- 결재 의견 작성                               |
| **시행자** | - 시행 완료 처리<br>- 시행 결과 보고                               |
| **참조자** | - 문서 열람 (읽기 전용)                                            |

---

## 📝 주요 개념

### 1. 결재선 스냅샷 (Approval Line Snapshot)

- 문서 제출 시 결재선 템플릿을 "동결"하여 생성
- 이후 결재선 템플릿이 변경되어도 제출된 문서의 결재선은 변경되지 않음
- 감사 추적성 보장

### 2. Assignee Rule (결재자 할당 규칙)

- `FIXED`: 고정 결재자
- `DRAFTER`: 기안자
- `DEPARTMENT_HEAD`: 부서장
- `POSITION_BASED`: 직책 기반
- `DOCUMENT_FIELD`: 문서 필드 기반 (조건부)

### 3. 결재 단계 타입

- `AGREEMENT`: 협의 (의견만 제시, 결재권 없음)
- `APPROVAL`: 결재 (승인/반려 가능)
- `IMPLEMENTATION`: 시행 (결재 완료 후 실행)
- `REFERENCE`: 참조 (알림만 수신)

---

## 📚 참고 자료

- [E2E 테스트 가이드](../test/approval-flow.e2e-spec.ts)
- [트랜잭션 사용 가이드](./transaction-usage.md)
- [결재 시스템 설계 문서](../src/modules_v2/business/approval-flow/README.md)

---

## 🔒 보안 고려사항

### JWT 토큰 관리

- JWT 토큰은 안전하게 저장하고 관리해야 합니다
- 토큰이 만료되면 재인증이 필요합니다
- HTTPS를 통해서만 API를 호출해야 합니다

### 권한 검증

- 모든 API는 서버 측에서 JWT 토큰을 검증합니다
- 사용자 ID는 토큰에서 추출되므로 클라이언트가 임의로 조작할 수 없습니다
- 결재, 협의, 시행 등의 작업은 해당 권한이 있는 사용자만 수행할 수 있습니다

---

**문서 버전:** 2.0.0  
**최종 업데이트:** 2025-10-21  
**작성자:** LIAS Development Team  
**변경 이력:**

- v2.0.0 (2025-10-21): JWT 인증 적용, 사용자 ID 자동 추출
- v1.0.0 (2025-10-21): 초기 버전
