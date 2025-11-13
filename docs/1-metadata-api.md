# 메타데이터 조회 API

## 기본 정보
- **Base URL**: `/metadata`
- **인증**: JWT Bearer Token (현재 비활성화)
- **설명**: 부서, 직원, 직급 등의 메타데이터를 조회하는 API

---

## 1.1 부서 목록 조회

```http
GET /metadata/departments
```

**응답 예시**
```json
[
  {
    "id": "dept-uuid-1",
    "departmentName": "개발본부",
    "departmentCode": "DEV",
    "parentDepartmentId": null,
    "level": 1,
    "sortOrder": 1
  },
  {
    "id": "dept-uuid-2",
    "departmentName": "개발팀",
    "departmentCode": "DEV-01",
    "parentDepartmentId": "dept-uuid-1",
    "level": 2,
    "sortOrder": 1
  }
]
```

---

## 1.2 부서별 직원 조회

```http
GET /metadata/departments/{departmentId}/employees
```

**Query Parameters**
| 파라미터 | 타입 | 필수 | 기본값 | 설명 |
|---------|------|------|--------|------|
| activeOnly | boolean | ❌ | true | 재직 중인 직원만 조회 |

**요청 예시**
```http
GET /metadata/departments/dept-uuid-1/employees?activeOnly=true
```

**응답 예시**
```json
[
  {
    "id": "emp-uuid-1",
    "employeeNumber": "E2023001",
    "name": "김철수",
    "email": "kim@example.com",
    "phone": "010-1234-5678",
    "isActive": true,
    "hireDate": "2023-01-01",
    "departmentPositions": [
      {
        "department": {
          "id": "dept-uuid-1",
          "departmentName": "개발본부"
        },
        "position": {
          "id": "pos-uuid-1",
          "positionTitle": "팀장"
        },
        "isManager": true
      }
    ]
  }
]
```

**에러 응답**
- `404`: 부서를 찾을 수 없음
- `400`: 잘못된 UUID 형식

---

## 1.3 계층구조 부서 및 직원 조회

```http
GET /metadata/departments/hierarchy/with-employees
```

**Query Parameters**
| 파라미터 | 타입 | 필수 | 기본값 | 설명 |
|---------|------|------|--------|------|
| activeOnly | boolean | ❌ | true | 재직 중인 직원만 조회 |

**응답 예시**
```json
[
  {
    "id": "dept-uuid-1",
    "departmentName": "개발본부",
    "departmentCode": "DEV",
    "level": 1,
    "employees": [
      {
        "id": "emp-uuid-1",
        "employeeNumber": "E2023001",
        "name": "김철수",
        "email": "kim@example.com"
      }
    ],
    "children": [
      {
        "id": "dept-uuid-2",
        "departmentName": "개발팀",
        "departmentCode": "DEV-01",
        "level": 2,
        "employees": [...],
        "children": []
      }
    ]
  }
]
```

---

## 1.4 직급 목록 조회

```http
GET /metadata/positions
```

**응답 예시**
```json
[
  {
    "id": "pos-uuid-1",
    "positionTitle": "사원",
    "positionCode": "STAFF",
    "level": 1,
    "sortOrder": 1
  },
  {
    "id": "pos-uuid-2",
    "positionTitle": "대리",
    "positionCode": "ASSISTANT_MANAGER",
    "level": 2,
    "sortOrder": 2
  },
  {
    "id": "pos-uuid-3",
    "positionTitle": "과장",
    "positionCode": "MANAGER",
    "level": 3,
    "sortOrder": 3
  }
]
```

---

## 1.5 직원 검색

```http
GET /metadata/employees
```

**Query Parameters**
| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|------|------|
| search | string | ❌ | 검색어 (이름 또는 직원번호) |
| departmentId | string (UUID) | ❌ | 부서 ID로 필터링 |

**요청 예시**
```http
GET /metadata/employees?search=김철수
GET /metadata/employees?departmentId=dept-uuid-1
GET /metadata/employees?search=E2023&departmentId=dept-uuid-1
```

**응답 예시**
```json
[
  {
    "id": "emp-uuid-1",
    "employeeNumber": "E2023001",
    "name": "김철수",
    "email": "kim@example.com",
    "phone": "010-1234-5678",
    "isActive": true,
    "hireDate": "2023-01-01",
    "departmentPositions": [...]
  }
]
```

**에러 응답**
- `400`: 잘못된 departmentId UUID 형식

---

## 1.6 직원 상세 조회

```http
GET /metadata/employees/{employeeId}
```

**Path Parameters**
| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|------|------|
| employeeId | string (UUID) | ✅ | 직원 ID |

**요청 예시**
```http
GET /metadata/employees/emp-uuid-1
```

**응답 예시**
```json
{
  "id": "emp-uuid-1",
  "employeeNumber": "E2023001",
  "name": "김철수",
  "email": "kim@example.com",
  "phone": "010-1234-5678",
  "isActive": true,
  "hireDate": "2023-01-01",
  "departmentPositions": [
    {
      "department": {
        "id": "dept-uuid-1",
        "departmentName": "개발본부",
        "departmentCode": "DEV"
      },
      "position": {
        "id": "pos-uuid-1",
        "positionTitle": "팀장",
        "positionCode": "TEAM_LEADER",
        "level": 4
      },
      "isManager": true,
      "startDate": "2023-01-01"
    }
  ]
}
```

**에러 응답**
- `404`: 직원을 찾을 수 없음
- `400`: 잘못된 UUID 형식

---

## 📌 참고

- 모든 조회 API는 재직 중인 직원만 기본 조회됩니다.
- 부서 및 직원 정보는 실시간으로 동기화됩니다.
- UUID 형식이 올바르지 않으면 `400` 에러가 반환됩니다.

