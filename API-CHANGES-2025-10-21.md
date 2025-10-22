# API 변경사항 문서

**날짜:** 2025-10-21  
**버전:** v2.0.1  
**변경 유형:** API 경로 재구성

---

## 📋 변경 개요

결재선 템플릿 및 문서양식 조회 API가 **Metadata API**에서 **Approval Flow API**로 이동되었습니다.

### 변경 이유

- 조직 메타데이터(부서, 직급, 직원)와 결재 흐름 설정(결재선 템플릿, 문서양식)을 명확히 분리
- 도메인별 책임 분리를 통한 아키텍처 개선
- API 엔드포인트의 의미적 일관성 확보

---

## 🔄 API 경로 변경

### 1. 결재선 템플릿 조회 API

#### 1.1 결재선 템플릿 목록 조회

**변경 전:**
- ~~`GET /api/v2/metadata/templates`~~

**변경 후:**
- `GET /api/v2/approval-flow/templates`

#### Request

**Query Parameters:**
- `type` (string, optional): 템플릿 유형 필터 (예: COMMON, DEDICATED)

#### Response

```typescript
Array<{
  id: string;
  name: string;
  type: 'COMMON' | 'DEDICATED';
  orgScope: 'COMPANY' | 'DEPARTMENT' | 'TEAM';
  status: 'ACTIVE' | 'INACTIVE';
  currentVersionId?: string;
  createdAt: Date;
  updatedAt: Date;
}>
```

#### Response Codes

- `200`: 조회 성공
- `401`: 인증 실패

---

#### 1.2 결재선 템플릿 상세 조회

**변경 전:**
- ~~`GET /api/v2/metadata/templates/:templateId`~~

**변경 후:**
- `GET /api/v2/approval-flow/templates/:templateId`

#### Path Parameters

- `templateId` (string, required): 결재선 템플릿 ID

#### Response

```typescript
{
  id: string;
  name: string;
  type: 'COMMON' | 'DEDICATED';
  orgScope: 'COMPANY' | 'DEPARTMENT' | 'TEAM';
  status: 'ACTIVE' | 'INACTIVE';
  currentVersionId?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

#### Response Codes

- `200`: 조회 성공
- `401`: 인증 실패
- `404`: 결재선 템플릿을 찾을 수 없음

---

#### 1.3 결재선 템플릿 버전 상세 조회

**변경 전:**
- ~~`GET /api/v2/metadata/templates/:templateId/versions/:versionId`~~

**변경 후:**
- `GET /api/v2/approval-flow/templates/:templateId/versions/:versionId`

#### Path Parameters

- `templateId` (string, required): 결재선 템플릿 ID
- `versionId` (string, required): 결재선 템플릿 버전 ID

#### Response

```typescript
{
  id: string;
  templateId: string;
  versionNo: number;
  isActive: boolean;
  changeReason?: string;
  createdAt: Date;
  updatedAt: Date;
  steps: Array<{
    id: string;
    lineTemplateVersionId: string;
    stepOrder: number;
    stepType: 'AGREEMENT' | 'APPROVAL' | 'IMPLEMENTATION' | 'REFERENCE';
    assigneeRule: 'FIXED' | 'DRAFTER' | 'DEPARTMENT_HEAD' | 'POSITION_BASED' | 'DOCUMENT_FIELD';
    defaultApproverId?: string;
    targetDepartmentId?: string;
    targetPositionId?: string;
    required: boolean;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
  }>;
}
```

#### Response Codes

- `200`: 조회 성공
- `401`: 인증 실패
- `404`: 결재선 템플릿 버전을 찾을 수 없음

---

### 2. 문서양식 조회 API

#### 2.1 문서양식 목록 조회

**변경 전:**
- ~~`GET /api/v2/metadata/forms`~~

**변경 후:**
- `GET /api/v2/approval-flow/forms`

#### Response

```typescript
Array<{
  id: string;
  name: string;
  code: string;
  description?: string;
  status: 'ACTIVE' | 'INACTIVE';
  currentVersionId?: string;
  createdAt: Date;
  updatedAt: Date;
}>
```

#### Response Codes

- `200`: 조회 성공
- `401`: 인증 실패

---

#### 2.2 문서양식 상세 조회

**변경 전:**
- ~~`GET /api/v2/metadata/forms/:formId`~~

**변경 후:**
- `GET /api/v2/approval-flow/forms/:formId`

#### Path Parameters

- `formId` (string, required): 문서양식 ID

#### Response

```typescript
{
  id: string;
  name: string;
  code: string;
  description?: string;
  status: 'ACTIVE' | 'INACTIVE';
  currentVersionId?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

#### Response Codes

- `200`: 조회 성공
- `401`: 인증 실패
- `404`: 문서양식을 찾을 수 없음

---

#### 2.3 문서양식 버전 상세 조회

**변경 전:**
- ~~`GET /api/v2/metadata/forms/:formId/versions/:versionId`~~

**변경 후:**
- `GET /api/v2/approval-flow/forms/:formId/versions/:versionId`

#### Path Parameters

- `formId` (string, required): 문서양식 ID
- `versionId` (string, required): 문서양식 버전 ID

#### Response

```typescript
{
  id: string;
  formId: string;
  versionNo: number;
  template: string;  // HTML 템플릿
  isActive: boolean;
  changeReason?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

#### Response Codes

- `200`: 조회 성공
- `401`: 인증 실패
- `404`: 문서양식 버전을 찾을 수 없음

---

## 📝 Metadata API 범위

변경 후 **Metadata API** (`/api/v2/metadata`)는 다음 API만 제공합니다:

### 조직 메타데이터 조회

- `GET /api/v2/metadata/departments` - 모든 부서 조회
- `GET /api/v2/metadata/departments/:departmentId/employees` - 특정 부서의 직원 조회
- `GET /api/v2/metadata/positions` - 모든 직책 조회
- `GET /api/v2/metadata/employees` - 직원 검색
- `GET /api/v2/metadata/employees/:employeeId` - 직원 상세 조회

---

## 📊 변경 요약 테이블

| 변경 전 경로 | 변경 후 경로 | 비고 |
|------------|------------|------|
| `GET /api/v2/metadata/templates` | `GET /api/v2/approval-flow/templates` | 결재선 템플릿 목록 |
| `GET /api/v2/metadata/templates/:templateId` | `GET /api/v2/approval-flow/templates/:templateId` | 결재선 템플릿 상세 |
| `GET /api/v2/metadata/templates/:templateId/versions/:versionId` | `GET /api/v2/approval-flow/templates/:templateId/versions/:versionId` | 결재선 템플릿 버전 상세 |
| `GET /api/v2/metadata/forms` | `GET /api/v2/approval-flow/forms` | 문서양식 목록 |
| `GET /api/v2/metadata/forms/:formId` | `GET /api/v2/approval-flow/forms/:formId` | 문서양식 상세 |
| `GET /api/v2/metadata/forms/:formId/versions/:versionId` | `GET /api/v2/approval-flow/forms/:formId/versions/:versionId` | 문서양식 버전 상세 |

---

## 🔧 클라이언트 마이그레이션 가이드

### API 호출 경로 수정

기존 클라이언트 코드에서 다음과 같이 경로를 변경해야 합니다:

```typescript
// 변경 전
const templates = await apiClient.get('/api/v2/metadata/templates');
const forms = await apiClient.get('/api/v2/metadata/forms');

// 변경 후
const templates = await apiClient.get('/api/v2/approval-flow/templates');
const forms = await apiClient.get('/api/v2/approval-flow/forms');
```

### 영향받는 클라이언트 코드

다음 파일들을 업데이트해야 합니다:

- 결재선 템플릿 선택 컴포넌트
- 문서양식 선택 컴포넌트
- 결재선 관리 페이지
- 문서양식 관리 페이지

---

## ⚠️ 중요 사항

### Backward Compatibility (하위 호환성)

- **이전 경로는 즉시 사용 불가능합니다**
- 클라이언트는 반드시 새 경로로 업데이트해야 합니다
- API 버전은 v2.0.0에서 v2.0.1로 마이너 업데이트되었습니다

### 배포 시 주의사항

1. **백엔드 배포 후**, 즉시 **클라이언트도 업데이트**해야 합니다
2. 동시 배포가 불가능한 경우, 임시로 양쪽 경로를 모두 지원하는 것을 고려하세요
3. API Gateway를 사용하는 경우, 경로 리다이렉션 규칙을 설정할 수 있습니다

---

## 🧪 테스트 가이드

### 변경 사항 검증

다음 테스트를 수행하여 변경 사항을 검증하세요:

1. **결재선 템플릿 조회**
   ```bash
   curl -X GET "http://localhost:3000/api/v2/approval-flow/templates" \
     -H "Authorization: Bearer YOUR_JWT_TOKEN"
   ```

2. **문서양식 조회**
   ```bash
   curl -X GET "http://localhost:3000/api/v2/approval-flow/forms" \
     -H "Authorization: Bearer YOUR_JWT_TOKEN"
   ```

3. **이전 경로 호출 시 404 확인**
   ```bash
   curl -X GET "http://localhost:3000/api/v2/metadata/templates" \
     -H "Authorization: Bearer YOUR_JWT_TOKEN"
   # Expected: 404 Not Found
   ```

---

**문서 버전:** v2.0.1  
**변경 일자:** 2025-10-21  
**작성자:** LIAS Development Team

