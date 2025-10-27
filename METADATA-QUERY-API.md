# Metadata Query API 문서

## 개요

Metadata Query API는 조직 메타데이터 조회를 담당하는 API입니다.

- 부서 목록 및 계층구조 조회
- 부서별 직원 조회
- 직원 검색 및 상세 조회
- 직급 목록 조회

**Base URL**: `/api/metadata`

**인증**: 모든 엔드포인트는 `Bearer Token` 인증이 필요합니다.

---

## API 엔드포인트 목록

### 부서 조회 API

1. [부서 목록 조회](#1-부서-목록-조회)
2. [부서별 직원 조회](#2-부서별-직원-조회)
3. [계층구조 부서 및 직원 조회](#3-계층구조-부서-및-직원-조회)

### 직원 조회 API

4. [직원 검색](#4-직원-검색)
5. [직원 상세 조회](#5-직원-상세-조회)

### 직급 조회 API

6. [직급 목록 조회](#6-직급-목록-조회)

---

## 1. 부서 목록 조회

모든 부서를 조회합니다.

**Endpoint**: `GET /api/metadata/departments`

**Response 200 OK**:

```json
[
    {
        "id": "dept-uuid",
        "departmentCode": "IT001",
        "departmentName": "개발본부",
        "type": "DIVISION",
        "order": 1,
        "parentDepartmentId": null,
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-01-01T00:00:00Z"
    },
    {
        "id": "dept-uuid-2",
        "departmentCode": "IT002",
        "departmentName": "개발팀",
        "type": "TEAM",
        "order": 1,
        "parentDepartmentId": "dept-uuid",
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-01-01T00:00:00Z"
    }
]
```

**에러 응답**:

- `401 Unauthorized`: 인증 실패

**테스트 시나리오**:

- ✅ 정상: 모든 부서 조회 (id, departmentName, departmentCode 포함)
- ❌ 실패: 인증 토큰 없음 (401 반환)

---

## 2. 부서별 직원 조회

특정 부서의 직원 목록을 조회합니다.

**Endpoint**: `GET /api/metadata/departments/:departmentId/employees`

**Path Parameters**:

| 파라미터       | 타입   | 설명    |
| -------------- | ------ | ------- |
| `departmentId` | string | 부서 ID |

**Query Parameters**:

| 파라미터     | 타입    | 필수 | 설명                                 |
| ------------ | ------- | ---- | ------------------------------------ |
| `activeOnly` | boolean | ❌   | 재직 중인 직원만 조회 (기본값: true) |

**Response 200 OK**:

```json
[
    {
        "id": "emp-uuid",
        "employeeNumber": "EMP001",
        "name": "홍길동",
        "email": "hong@example.com",
        "phoneNumber": "010-1234-5678",
        "status": "Active",
        "hireDate": "2020-01-01",
        "departments": [
            {
                "department": {
                    "id": "dept-uuid",
                    "departmentCode": "IT001",
                    "departmentName": "개발본부"
                },
                "position": {
                    "id": "pos-uuid",
                    "positionCode": "SR001",
                    "positionTitle": "시니어 개발자",
                    "level": 5,
                    "hasManagementAuthority": false
                }
            }
        ]
    }
]
```

**에러 응답**:

- `400 Bad Request`: 잘못된 UUID 형식
- `401 Unauthorized`: 인증 실패
- `404 Not Found`: 부서를 찾을 수 없음

**테스트 시나리오**:

- ✅ 정상: 특정 부서의 직원 목록 조회
- ✅ 정상: activeOnly=true로 재직 직원만 조회
- ✅ 정상: activeOnly=false로 모든 직원 조회 (퇴사자 포함)
- ❌ 실패: 존재하지 않는 부서 ID (404 반환)
- ❌ 실패: 잘못된 UUID 형식 (400 반환)
- ❌ 실패: 인증 토큰 없음 (401 반환)

---

## 3. 계층구조 부서 및 직원 조회

모든 부서를 계층 구조 형태로 조회하며, 각 부서의 직원 정보도 함께 반환합니다.

**Endpoint**: `GET /api/metadata/departments/hierarchy/with-employees`

**Query Parameters**:

| 파라미터     | 타입    | 필수 | 설명                                 |
| ------------ | ------- | ---- | ------------------------------------ |
| `activeOnly` | boolean | ❌   | 재직 중인 직원만 조회 (기본값: true) |

**Response 200 OK**:

```json
[
    {
        "id": "dept-uuid",
        "departmentCode": "IT001",
        "departmentName": "개발본부",
        "type": "DIVISION",
        "order": 1,
        "parentDepartmentId": null,
        "employees": [
            {
                "id": "emp-uuid-1",
                "employeeNumber": "EMP001",
                "name": "홍길동",
                "email": "hong@example.com",
                "phoneNumber": "010-1234-5678",
                "status": "Active",
                "departmentId": "dept-uuid",
                "positionTitle": "부장",
                "positionLevel": 7
            }
        ],
        "children": [
            {
                "id": "dept-uuid-2",
                "departmentCode": "IT002",
                "departmentName": "개발팀",
                "type": "TEAM",
                "order": 1,
                "parentDepartmentId": "dept-uuid",
                "employees": [
                    {
                        "id": "emp-uuid-2",
                        "employeeNumber": "EMP002",
                        "name": "김철수",
                        "email": "kim@example.com",
                        "phoneNumber": "010-5678-9012",
                        "status": "Active",
                        "departmentId": "dept-uuid-2",
                        "positionTitle": "팀장",
                        "positionLevel": 6
                    }
                ],
                "children": []
            }
        ]
    }
]
```

**응답 구조**:

- 각 부서 객체는 `children` 배열을 포함하여 하위 부서를 재귀적으로 표현
- 각 부서의 `employees` 배열에는 해당 부서의 직원 목록 포함
- 직원 정보에는 현재 부서에서의 역할(위치, 직급)이 포함됨

**에러 응답**:

- `401 Unauthorized`: 인증 실패

**테스트 시나리오**:

- ✅ 정상: 계층구조 부서 및 직원 조회
- ✅ 정상: activeOnly=true로 재직 직원만 조회
- ✅ 정상: activeOnly=false로 모든 직원 조회
- ❌ 실패: 인증 토큰 없음 (401 반환)

---

## 4. 직원 검색

이름 또는 직원번호로 직원을 검색합니다.

**Endpoint**: `GET /api/metadata/employees`

**Query Parameters**:

| 파라미터       | 타입   | 필수 | 설명                        |
| -------------- | ------ | ---- | --------------------------- |
| `search`       | string | ❌   | 검색어 (이름 또는 직원번호) |
| `departmentId` | string | ❌   | 부서 ID (부서별 필터링)     |

**Response 200 OK**:

```json
[
    {
        "id": "emp-uuid",
        "employeeNumber": "EMP001",
        "name": "홍길동",
        "email": "hong@example.com",
        "phoneNumber": "010-1234-5678",
        "status": "Active",
        "hireDate": "2020-01-01",
        "departments": [
            {
                "department": {
                    "id": "dept-uuid",
                    "departmentCode": "IT001",
                    "departmentName": "개발본부"
                },
                "position": {
                    "id": "pos-uuid",
                    "positionCode": "SR001",
                    "positionTitle": "시니어 개발자",
                    "level": 5,
                    "hasManagementAuthority": false
                }
            }
        ]
    }
]
```

**에러 응답**:

- `400 Bad Request`: 잘못된 departmentId UUID 형식
- `401 Unauthorized`: 인증 실패

**검색 동작**:

- 검색어는 이름, 직원번호, 이메일에 대해 부분 일치로 검색
- 검색어가 없으면 모든 직원 조회
- departmentId가 있으면 해당 부서의 직원만 필터링

**테스트 시나리오**:

- ✅ 정상: 모든 직원 조회 (필터 없음)
- ✅ 정상: 이름으로 검색
- ✅ 정상: 직원번호로 검색
- ✅ 정상: 부서별 필터링
- ✅ 정상: 검색어 + 부서 조합 필터
- ✅ 정상: 검색 결과 없음 (빈 배열 반환)
- ✅ 정상: 빈 검색어 (전체 조회와 동일)
- ✅ 정상: 한글, 공백, 특수문자, 긴 검색어 처리
- ❌ 실패: 잘못된 departmentId UUID 형식 (400 반환)
- ❌ 실패: 인증 토큰 없음 (401 반환)

---

## 5. 직원 상세 조회

특정 직원의 상세 정보를 조회합니다.

**Endpoint**: `GET /api/metadata/employees/:employeeId`

**Path Parameters**:

| 파라미터     | 타입   | 설명    |
| ------------ | ------ | ------- |
| `employeeId` | string | 직원 ID |

**Response 200 OK**:

```json
{
    "id": "emp-uuid",
    "employeeNumber": "EMP001",
    "name": "홍길동",
    "email": "hong@example.com",
    "phoneNumber": "010-1234-5678",
    "status": "Active",
    "hireDate": "2020-01-01",
    "departments": [
        {
            "department": {
                "id": "dept-uuid",
                "departmentCode": "IT001",
                "departmentName": "개발본부"
            },
            "position": {
                "id": "pos-uuid",
                "positionCode": "SR001",
                "positionTitle": "시니어 개발자",
                "level": 5,
                "hasManagementAuthority": false
            }
        },
        {
            "department": {
                "id": "dept-uuid-2",
                "departmentCode": "IT002",
                "departmentName": "개발팀"
            },
            "position": {
                "id": "pos-uuid-2",
                "positionCode": "L001",
                "positionTitle": "리드 개발자",
                "level": 6,
                "hasManagementAuthority": true
            }
        }
    ]
}
```

**응답 구조**:

- `departments` 배열에는 직원이 소속된 모든 부서와 각 부서에서의 직급 정보가 포함됨
- 하나의 직원이 여러 부서에 소속될 수 있음 (겸직)

**에러 응답**:

- `400 Bad Request`: 잘못된 UUID 형식
- `401 Unauthorized`: 인증 실패
- `404 Not Found`: 직원을 찾을 수 없음

**테스트 시나리오**:

- ✅ 정상: 특정 직원 상세 정보 조회
- ✅ 정상: 여러 부서에 소속된 직원 정보 조회
- ❌ 실패: 존재하지 않는 직원 ID (404 반환)
- ❌ 실패: 잘못된 UUID 형식 (400 반환)
- ❌ 실패: 인증 토큰 없음 (401 반환)

---

## 6. 직급 목록 조회

모든 직급을 조회합니다.

**Endpoint**: `GET /api/metadata/positions`

**Response 200 OK**:

```json
[
    {
        "id": "pos-uuid",
        "positionCode": "SR001",
        "positionTitle": "시니어 개발자",
        "level": 5,
        "hasManagementAuthority": false,
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-01-01T00:00:00Z"
    },
    {
        "id": "pos-uuid-2",
        "positionCode": "L001",
        "positionTitle": "팀장",
        "level": 6,
        "hasManagementAuthority": true,
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-01-01T00:00:00Z"
    }
]
```

**필드 설명**:

| 필드                     | 타입    | 설명                |
| ------------------------ | ------- | ------------------- |
| `id`                     | string  | 직급 ID             |
| `positionCode`           | string  | 직급 코드           |
| `positionTitle`          | string  | 직급명              |
| `level`                  | number  | 직급 레벨           |
| `hasManagementAuthority` | boolean | 관리 권한 보유 여부 |
| `createdAt`              | Date    | 생성 일시           |
| `updatedAt`              | Date    | 수정 일시           |

**에러 응답**:

- `401 Unauthorized`: 인증 실패

**테스트 시나리오**:

- ✅ 정상: 모든 직급 조회 (id, positionTitle, positionCode, level 포함)
- ❌ 실패: 인증 토큰 없음 (401 반환)

---

## 공통 에러 응답

### 400 Bad Request

잘못된 요청입니다. 잘못된 UUID 형식 등이 원인입니다.

```json
{
    "statusCode": 400,
    "message": "departmentId는 유효한 UUID 형식이어야 합니다",
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
    "message": "ID가 {departmentId}인 부서를 찾을 수 없습니다",
    "error": "Not Found"
}
```

---

## 주요 개념

### EmployeeDepartmentPosition

직원과 부서/직급의 매핑을 나타내는 엔티티입니다. 한 직원은 여러 부서에 소속될 수 있고, 각 부서에서 다른 직급을 가질 수 있습니다.

**예시**:

- 직원 A: 개발본부 - 부장, 개발팀 - 팀장 (겸직)

### 재직 상태 (EmployeeStatus)

- `Active`: 재직 중
- `Inactive`: 퇴사

### 부서 계층 구조

부서는 계층 구조를 가지며, `parentDepartmentId`를 통해 상위 부서를 참조합니다.

**예시**:

```
개발본부
  └─ 개발팀
      └─ 백엔드팀
      └─ 프론트엔드팀
```

---

## 테스트 시나리오

### 정상 시나리오

- ✅ 모든 부서 조회
- ✅ 특정 부서의 직원 목록 조회
- ✅ 계층구조 부서 및 직원 조회
- ✅ 직원 검색 (이름)
- ✅ 직원 검색 (직원번호)
- ✅ 직원 검색 (부서 필터)
- ✅ 특정 직원 상세 조회
- ✅ 모든 직급 조회
- ✅ 재직 직원만 조회 (activeOnly=true)
- ✅ 모든 직원 조회 (activeOnly=false)

### 예외 시나리오

- ❌ 존재하지 않는 부서 ID (404 반환)
- ❌ 존재하지 않는 직원 ID (404 반환)
- ❌ 잘못된 UUID 형식 (400 반환)
- ❌ 인증 토큰 없음 (401 반환)
