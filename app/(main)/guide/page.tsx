"use client";

import { useState } from "react";
import TabNavigationPanel from "./components/tab-navigation-panel";
import GuideContentSection from "./sections/guide-content-section";

export default function GuidePage() {
  const [activeTab, setActiveTab] = useState<
    "overview" | "glossary" | "flow" | "entities" | "roles" | "status"
  >("overview");

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">결재 시스템 가이드</h1>
        <p className="mt-2 text-sm text-gray-600">
          결재 시스템의 구조와 흐름을 이해하고 효과적으로 사용하는 방법을
          안내합니다.
        </p>
      </div>

      {/* 탭 메뉴 */}
      <TabNavigationPanel
        activeTab={activeTab}
        onTabChange={(tab) =>
          setActiveTab(
            tab as
              | "overview"
              | "glossary"
              | "flow"
              | "entities"
              | "roles"
              | "status"
          )
        }
      />

      {/* 탭 내용 */}
      <GuideContentSection
        activeTab={activeTab}
        OverviewSection={OverviewSection}
        GlossarySection={GlossarySection}
        FlowSection={FlowSection}
        EntitiesSection={EntitiesSection}
        RolesSection={RolesSection}
        StatusSection={StatusSection}
      />
    </div>
  );
}

// 시스템 개요
function OverviewSection() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">시스템 개요</h2>
        <p className="text-gray-700 leading-relaxed">
          이 결재 시스템은 조직의 문서 승인 프로세스를 디지털화하여 효율적으로
          관리할 수 있도록 설계되었습니다. 문서 작성부터 결재, 시행까지 전체
          프로세스를 지원합니다.
        </p>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-blue-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              <strong>핵심 특징:</strong> 결재선 스냅샷을 통한 불변성 보장,
              다양한 결재 역할 지원, 유연한 결재 흐름 설정
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-2">📝 문서 관리</h3>
          <p className="text-sm text-gray-600">
            다양한 양식의 문서를 작성하고 관리할 수 있습니다. 임시 저장, 수정,
            취소 기능을 제공합니다.
          </p>
        </div>
        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-2">✅ 결재 프로세스</h3>
          <p className="text-sm text-gray-600">
            결재자, 협의자, 시행자, 참조자 등 다양한 역할을 지원하는 결재라인을
            구성할 수 있습니다.
          </p>
        </div>
        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-2">🔒 불변성 보장</h3>
          <p className="text-sm text-gray-600">
            결재 시작 시점의 결재선을 스냅샷으로 저장하여 결재 중 변경을
            방지합니다.
          </p>
        </div>
      </div>
    </div>
  );
}

// 용어 정의
function GlossarySection() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">용어 정의</h2>
        <p className="text-gray-700 mb-6">
          결재 시스템에서 사용하는 주요 용어와 개념을 설명합니다.
        </p>
      </div>

      {/* 템플릿 관련 용어 */}
      <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-r-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          📝 템플릿 (관리 측면)
        </h3>
        <p className="text-sm text-gray-700 mb-4">
          관리자가 생성하고 관리하는 재사용 가능한 템플릿들입니다.
        </p>

        <div className="space-y-3">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h4 className="font-semibold text-gray-900 mb-2">
              문서 템플릿 (Document Template)
            </h4>
            <p className="text-sm text-gray-700 mb-2">
              문서 작성을 위한 양식 템플릿입니다. HTML 템플릿과 결재단계
              템플릿들을 포함합니다.
            </p>
            <ul className="text-xs text-gray-600 list-disc list-inside space-y-1">
              <li>HTML 템플릿: 문서의 구조와 스타일 정의</li>
              <li>결재단계 템플릿: 결재 프로세스 규칙 정의</li>
              <li>카테고리: 문서 분류를 위한 카테고리 연결</li>
              <li>상태: DRAFT, ACTIVE, INACTIVE, ARCHIVED</li>
            </ul>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h4 className="font-semibold text-gray-900 mb-2">
              결재단계 템플릿 (Approval Step Template)
            </h4>
            <p className="text-sm text-gray-700 mb-2">
              문서 템플릿 내에서 각 결재 단계의 담당자를 결정하는 규칙을
              정의합니다.
            </p>
            <ul className="text-xs text-gray-600 list-disc list-inside space-y-1">
              <li>
                단계 타입: AGREEMENT(협의), APPROVAL(결재),
                IMPLEMENTATION(시행), REFERENCE(참조)
              </li>
              <li>단계 순서: 결재 진행 순서 정의</li>
              <li>할당 규칙 (AssigneeRule): 담당자 결정 방식</li>
              <li>대상 정보: 규칙에 따른 직원/부서/직책 지정</li>
            </ul>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h4 className="font-semibold text-gray-900 mb-2">
              할당 규칙 (Assignee Rule)
            </h4>
            <p className="text-sm text-gray-700 mb-2">
              결재단계 템플릿에서 담당자를 자동으로 결정하는 규칙입니다.
            </p>
            <ul className="text-xs text-gray-600 list-disc list-inside space-y-1">
              <li>FIXED: 고정 결재자 (특정 직원 지정)</li>
              <li>DRAFTER: 기안자 본인</li>
              <li>DEPARTMENT_HEAD: 기안자의 부서장</li>
              <li>HIERARCHY_TO_SUPERIOR: 기안자의 직속 상급자</li>
              <li>HIERARCHY_TO_POSITION: 특정 직책까지의 상급자 전체</li>
              <li>SPECIFIC_EMPLOYEE: 특정 직원</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 문서 관련 용어 */}
      <div className="bg-green-50 border-l-4 border-green-400 p-6 rounded-r-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          📄 문서 (실제 데이터)
        </h3>
        <p className="text-sm text-gray-700 mb-4">
          사용자가 템플릿을 사용해서 작성한 실제 문서입니다.
        </p>

        <div className="space-y-3">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h4 className="font-semibold text-gray-900 mb-2">
              문서 (Document)
            </h4>
            <p className="text-sm text-gray-700 mb-2">
              문서템플릿을 사용하여 작성된 실제 기안 문서입니다. 작성자는 자신의
              내용을 추가하여 저장합니다.
            </p>
            <ul className="text-xs text-gray-600 list-disc list-inside space-y-1">
              <li>제목, 내용, 메타데이터 포함</li>
              <li>임시저장 가능 (DRAFT 상태)</li>
              <li>제출 시 결재 프로세스 시작</li>
            </ul>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h4 className="font-semibold text-gray-900 mb-2">
              문서 상태 (Document Status)
            </h4>
            <p className="text-sm text-gray-700 mb-2">
              문서의 처리 상태를 나타냅니다.
            </p>
            <ul className="text-xs text-gray-600 list-disc list-inside space-y-1">
              <li>DRAFT: 임시저장, 수정 가능</li>
              <li>PENDING: 결재 대기 중</li>
              <li>APPROVED: 결재 완료</li>
              <li>REJECTED: 반려됨</li>
              <li>IMPLEMENTED: 시행 완료</li>
              <li>CANCELLED: 취소됨</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 스냅샷 관련 용어 */}
      <div className="bg-purple-50 border-l-4 border-purple-400 p-6 rounded-r-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          🔒 스냅샷 (불변성 보장)
        </h3>
        <p className="text-sm text-gray-700 mb-4">
          문서 제출 시 결재단계 템플릿이 실제 담당자가 지정된 스냅샷으로
          변환됩니다.
        </p>

        <div className="space-y-3">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h4 className="font-semibold text-gray-900 mb-2">
              결재단계 스냅샷 (Approval Step Snapshot)
            </h4>
            <p className="text-sm text-gray-700 mb-2">
              문서 제출 시점에 결재단계 템플릿의 할당 규칙이 실행되어 실제
              담당자가 결정되고 고정된 데이터입니다.
            </p>
            <ul className="text-xs text-gray-600 list-disc list-inside space-y-1">
              <li>실제 결재자 ID 저장 (할당 규칙 실행 결과)</li>
              <li>
                결재자 스냅샷 메타데이터: 제출 시점의 부서/직책/직급 정보
                (JSONB)
              </li>
              <li>결재 진행 상태: PENDING → APPROVED/REJECTED</li>
              <li>결재 이력: 의견, 승인/반려 시각 기록</li>
              <li>불변성 보장: 템플릿 변경 시에도 영향받지 않음</li>
            </ul>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-yellow-400">
            <h4 className="font-semibold text-gray-900 mb-2">
              결재자 스냅샷 메타데이터 (Approver Snapshot Metadata)
            </h4>
            <p className="text-sm text-gray-700 mb-2">
              결재단계 스냅샷에 JSONB로 저장되는 결재자의 시점 정보입니다.
            </p>
            <ul className="text-xs text-gray-600 list-disc list-inside space-y-1">
              <li>departmentId / departmentName: 결재자의 부서 정보</li>
              <li>positionId / positionTitle: 결재자의 직책 정보</li>
              <li>rankId / rankTitle: 결재자의 직급 정보</li>
              <li>employeeName / employeeNumber: 결재자의 기본 정보</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 용어 관계도 */}
      <div className="mt-8 bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          용어 관계도
        </h3>
        <div className="text-sm text-gray-700 space-y-3">
          <div className="bg-white p-4 rounded-lg">
            <div className="font-semibold mb-2">📊 템플릿 계층 (관리):</div>
            <div className="text-xs space-y-1 pl-4">
              <div>DocumentTemplate (문서 템플릿)</div>
              <div className="text-gray-400">├─ name, code, status</div>
              <div className="text-gray-400">├─ template (HTML)</div>
              <div className="text-gray-400">├─ category (카테고리)</div>
              <div className="text-gray-400">
                └─ approvalStepTemplates (결재단계 템플릿 목록)
              </div>
              <div className="text-gray-400 pl-6">└─ ApprovalStepTemplate</div>
              <div className="text-gray-400 pl-12">├─ stepOrder, stepType</div>
              <div className="text-gray-400 pl-12">
                ├─ assigneeRule (할당 규칙)
              </div>
              <div className="text-gray-400 pl-12">
                └─ targetEmployeeId / targetDepartmentId / targetPositionId
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg">
            <div className="font-semibold mb-2">📝 문서 생성 흐름:</div>
            <div className="text-xs space-y-1 pl-4">
              <div>1. 문서 템플릿 선택</div>
              <div className="text-gray-400">
                └─ HTML 템플릿 + 결재단계 템플릿 불러오기
              </div>
              <div className="mt-2">2. 문서 작성</div>
              <div className="text-gray-400">└─ Document 생성 (DRAFT 상태)</div>
              <div className="mt-2">3. 임시저장</div>
              <div className="text-gray-400">└─ 수정/삭제 가능</div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border-l-4 border-purple-400">
            <div className="font-semibold mb-2">
              🔄 제출 프로세스 (스냅샷 생성):
            </div>
            <div className="text-xs space-y-1 pl-4">
              <div>문서 제출 시</div>
              <div className="text-gray-400">
                ├─ 결재단계 템플릿의 할당 규칙 실행
              </div>
              <div className="text-gray-400">│ └─ FIXED → 지정된 직원</div>
              <div className="text-gray-400">
                │ └─ DEPARTMENT_HEAD → 기안자의 부서장 조회
              </div>
              <div className="text-gray-400">
                │ └─ HIERARCHY_TO_SUPERIOR → 상급자 조회
              </div>
              <div className="text-gray-400">├─ 결재단계 스냅샷 생성</div>
              <div className="text-gray-400">
                │ ├─ approverId (실제 결재자 ID)
              </div>
              <div className="text-gray-400">
                │ ├─ approverSnapshot (시점 정보 JSONB)
              </div>
              <div className="text-gray-400">│ └─ status (PENDING)</div>
              <div className="text-gray-400">└─ 문서 상태 → PENDING</div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg">
            <div className="font-semibold mb-2">✅ 결재 진행:</div>
            <div className="text-xs space-y-1 pl-4">
              <div>Document (문서)</div>
              <div className="text-gray-400">
                └─ approvalSteps (결재단계 스냅샷 목록)
              </div>
              <div className="text-gray-400 pl-6">└─ ApprovalStepSnapshot</div>
              <div className="text-gray-400 pl-12">├─ 결재자 처리</div>
              <div className="text-gray-400 pl-12">├─ status 업데이트</div>
              <div className="text-gray-400 pl-12">
                └─ comment, approvedAt 기록
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 결재 흐름
function FlowSection() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">결재 흐름</h2>
        <p className="text-gray-700 mb-6">
          문서가 작성되어 최종 완료되기까지의 전체 프로세스를 단계별로
          설명합니다.
        </p>
      </div>

      <div className="space-y-4">
        {/* Step 1 */}
        <div className="flex">
          <div className="flex-shrink-0">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600 font-semibold">
              1
            </div>
          </div>
          <div className="ml-4 flex-1">
            <h3 className="text-lg font-semibold text-gray-900">
              문서 작성 (DRAFT)
            </h3>
            <p className="text-gray-600 mt-1">
              작성자가 문서를 작성하고 임시 저장합니다. 이 단계에서는 문서를
              수정하거나 삭제할 수 있습니다.
            </p>
            <div className="mt-2 text-sm text-gray-500">
              • 문서템플릿 선택 → 내용 작성 → 임시저장
            </div>
          </div>
        </div>

        <div className="ml-5 border-l-2 border-gray-300 h-8"></div>

        {/* Step 2 */}
        <div className="flex">
          <div className="flex-shrink-0">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-100 text-purple-600 font-semibold">
              2
            </div>
          </div>
          <div className="ml-4 flex-1">
            <h3 className="text-lg font-semibold text-gray-900">
              문서 제출 (PENDING)
            </h3>
            <p className="text-gray-600 mt-1">
              작성자가 문서를 제출합니다. 이 시점에 문서 템플릿의 결재단계
              템플릿이 실행되어 실제 결재자가 결정되고 스냅샷으로 고정되며, 문서
              번호가 발급됩니다.
            </p>
            <div className="mt-2 text-sm text-gray-500">
              • 제출 → 할당 규칙 실행 → 결재자 결정 → 스냅샷 생성 → PENDING
              상태로 전환
            </div>
          </div>
        </div>

        <div className="ml-5 border-l-2 border-gray-300 h-8"></div>

        {/* Step 3 */}
        <div className="flex">
          <div className="flex-shrink-0">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-yellow-100 text-yellow-600 font-semibold">
              3
            </div>
          </div>
          <div className="ml-4 flex-1">
            <h3 className="text-lg font-semibold text-gray-900">
              협의 프로세스 (선택적)
            </h3>
            <p className="text-gray-600 mt-1">
              결재선에 협의자가 포함된 경우, 협의자들이 사전 검토 및 의견을
              작성합니다. 모든 협의자가 협의 완료해야 다음 단계로 진행됩니다.
            </p>
            <div className="mt-2 text-sm text-gray-500">
              • 협의자 A 검토 → 협의자 B 검토 → 모두 협의 완료
            </div>
          </div>
        </div>

        <div className="ml-5 border-l-2 border-gray-300 h-8"></div>

        {/* Step 4 */}
        <div className="flex">
          <div className="flex-shrink-0">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100 text-green-600 font-semibold">
              4
            </div>
          </div>
          <div className="ml-4 flex-1">
            <h3 className="text-lg font-semibold text-gray-900">
              순차 결재 진행
            </h3>
            <p className="text-gray-600 mt-1">
              결재라인의 순서대로 각 결재자가 승인 또는 반려합니다. 한 명이라도
              반려하면 문서는 REJECTED 상태가 됩니다.
            </p>
            <div className="mt-2 text-sm text-gray-500">
              • 결재자 A 승인 → 결재자 B 승인 → 결재자 C 승인
            </div>
          </div>
        </div>

        <div className="ml-5 border-l-2 border-gray-300 h-8"></div>

        {/* Step 5 */}
        <div className="flex">
          <div className="flex-shrink-0">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-500 text-white font-semibold">
              5
            </div>
          </div>
          <div className="ml-4 flex-1">
            <h3 className="text-lg font-semibold text-gray-900">
              결재 완료 (APPROVED)
            </h3>
            <p className="text-gray-600 mt-1">
              모든 결재자가 승인하면 문서는 APPROVED 상태가 됩니다. 시행자가
              지정된 경우 시행자에게 전달됩니다.
            </p>
            <div className="mt-2 text-sm text-gray-500">
              • 모든 결재 승인 → 문서 확정 → 시행자에게 전달
            </div>
          </div>
        </div>

        <div className="ml-5 border-l-2 border-gray-300 h-8"></div>

        {/* Step 6 */}
        <div className="flex">
          <div className="flex-shrink-0">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 font-semibold">
              6
            </div>
          </div>
          <div className="ml-4 flex-1">
            <h3 className="text-lg font-semibold text-gray-900">
              시행 (IMPLEMENTED)
            </h3>
            <p className="text-gray-600 mt-1">
              시행자가 결재 완료된 문서를 실제로 실행하고 결과를 보고합니다.
              모든 프로세스가 완료됩니다.
            </p>
            <div className="mt-2 text-sm text-gray-500">
              • 시행자 실행 → 결과 보고 → 완료 알림 → 참조자에게 공유
            </div>
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-yellow-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              <strong>중요:</strong> 문서가 제출되면 결재단계가 스냅샷으로
              고정되어 변경할 수 없습니다. 반려된 경우 작성자가 수정 후 다시
              제출해야 합니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// 데이터 구조
function EntitiesSection() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">데이터 구조</h2>
        <p className="text-gray-700 mb-6">
          결재 시스템을 구성하는 주요 데이터 엔티티와 그 역할을 설명합니다.
        </p>
      </div>

      <div className="space-y-4">
        {/* DocumentTemplate */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-mono mr-2">
              DocumentTemplate
            </span>
            문서 템플릿
          </h3>
          <p className="text-gray-700 mb-3">
            문서의 기본 양식을 정의합니다. HTML 템플릿과 결재단계 템플릿들을
            포함합니다.
          </p>
          <div className="bg-gray-50 p-3 rounded">
            <p className="text-sm text-gray-600">
              <strong>속성:</strong> 이름(name), 코드(code), 설명(description),
              상태(status), HTML 템플릿(template), 카테고리(categoryId)
            </p>
            <p className="text-sm text-gray-600 mt-1">
              <strong>관계:</strong> Category (다대일), ApprovalStepTemplate
              (일대다)
            </p>
            <p className="text-sm text-gray-600 mt-1">
              <strong>예시:</strong> 지출결의서, 휴가신청서, 구매요청서
            </p>
          </div>
        </div>

        {/* Document */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-mono mr-2">
              Document
            </span>
            문서
          </h3>
          <p className="text-gray-700 mb-3">
            실제 작성된 문서입니다. 문서 템플릿을 기반으로 작성되며, 결재단계
            스냅샷과 연결됩니다.
          </p>
          <div className="bg-gray-50 p-3 rounded">
            <p className="text-sm text-gray-600">
              <strong>속성:</strong> 제목(title), 내용(content), 상태(status),
              기안자(drafterId), 문서번호(documentNumber),
              제출일시(submittedAt), 완료일시(approvedAt)
            </p>
            <p className="text-sm text-gray-600 mt-1">
              <strong>관계:</strong> Employee (기안자, 다대일),
              ApprovalStepSnapshot (일대다)
            </p>
            <p className="text-sm text-gray-600 mt-1">
              <strong>라이프사이클:</strong> DRAFT → PENDING → APPROVED/REJECTED
              → IMPLEMENTED
            </p>
          </div>
        </div>

        {/* ApprovalStepTemplate */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
            <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-sm font-mono mr-2">
              ApprovalStepTemplate
            </span>
            결재 단계 템플릿
          </h3>
          <p className="text-gray-700 mb-3">
            문서 템플릿 내의 각 결재 단계를 정의합니다. 순서, 역할, 담당자 할당
            규칙을 포함합니다.
          </p>
          <div className="bg-gray-50 p-3 rounded">
            <p className="text-sm text-gray-600">
              <strong>속성:</strong> 문서템플릿ID(documentTemplateId),
              단계순서(stepOrder), 단계유형(stepType), 할당규칙(assigneeRule),
              대상직원(targetEmployeeId), 대상부서(targetDepartmentId),
              대상직책(targetPositionId)
            </p>
            <p className="text-sm text-gray-600 mt-1">
              <strong>관계:</strong> DocumentTemplate (다대일), Employee
              (다대일), Department (다대일), Position (다대일)
            </p>
            <p className="text-sm text-gray-600 mt-1">
              <strong>단계 유형:</strong> AGREEMENT(협의), APPROVAL(결재),
              IMPLEMENTATION(시행), REFERENCE(참조)
            </p>
            <p className="text-sm text-gray-600 mt-1">
              <strong>할당 규칙:</strong> FIXED(고정), DRAFTER(기안자),
              DEPARTMENT_HEAD(부서장), HIERARCHY_TO_SUPERIOR(상급자),
              HIERARCHY_TO_POSITION(직책까지), SPECIFIC_EMPLOYEE(특정직원)
            </p>
          </div>
        </div>

        {/* ApprovalStepSnapshot */}
        <div className="border border-yellow-200 bg-yellow-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
            <span className="bg-yellow-200 text-yellow-900 px-2 py-1 rounded text-sm font-mono mr-2">
              ApprovalStepSnapshot
            </span>
            결재 단계 스냅샷 🔒
          </h3>
          <p className="text-gray-700 mb-3">
            문서 제출 시점에 결재단계 템플릿이 실행되어 생성된{" "}
            <strong>불변 데이터</strong>입니다. 실제 결재 진행 상황과 결과가 이
            데이터에 기록됩니다.
          </p>
          <div className="bg-white p-3 rounded border border-yellow-300">
            <p className="text-sm text-gray-600">
              <strong>핵심 역할:</strong> 결재 중 결재자 변경 방지, 감사 추적성
              보장, 히스토리 보존
            </p>
            <p className="text-sm text-gray-600 mt-1">
              <strong>생성 시점:</strong> 문서 제출(submit) 시 할당 규칙 실행 →
              실제 결재자 결정 → 스냅샷 생성
            </p>
            <p className="text-sm text-gray-600 mt-1">
              <strong>속성:</strong> 문서ID(documentId), 단계순서(stepOrder),
              단계유형(stepType), 결재자ID(approverId),
              결재자스냅샷(approverSnapshot), 상태(status), 의견(comment),
              승인시각(approvedAt)
            </p>
            <p className="text-sm text-gray-600 mt-1">
              <strong>관계:</strong> Document (다대일), Employee (결재자,
              다대일)
            </p>
            <p className="text-sm text-gray-600 mt-1">
              <strong>상태:</strong> PENDING → APPROVED/REJECTED/COMPLETED
            </p>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mt-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-blue-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              <strong>템플릿 vs 스냅샷:</strong> DocumentTemplate과
              ApprovalStepTemplate은 재사용 가능한 설계도이며,
              ApprovalStepSnapshot은 문서 제출 시 생성되는 고정된 실체입니다.
              템플릿 수정은 새로운 문서에만 적용되며, 이미 제출된 문서의
              스냅샷은 변경되지 않습니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// 결재라인 역할
function RolesSection() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">결재라인 역할</h2>
        <p className="text-gray-700 mb-6">
          결재 프로세스에 참여하는 각 역할의 권한과 책임을 설명합니다.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                역할
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                설명
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                수행 가능 기능
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                제한 사항
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <tr>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  결재자
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-900">
                  문서를 승인하거나 반려하는 책임자
                </div>
              </td>
              <td className="px-6 py-4">
                <ul className="text-sm text-gray-700 list-disc list-inside space-y-1">
                  <li>결재 승인 / 반려</li>
                  <li>의견 작성</li>
                  <li>첨부파일 열람</li>
                  <li>결재 완료 시 다음 단계로 이동</li>
                </ul>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-500">-</div>
              </td>
            </tr>
            <tr className="bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                  협의자
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-900">
                  결재 전 사전 협의자, 승인권은 없음
                </div>
              </td>
              <td className="px-6 py-4">
                <ul className="text-sm text-gray-700 list-disc list-inside space-y-1">
                  <li>협의 의견 작성</li>
                  <li>협의 완료 처리</li>
                  <li>첨부파일 열람</li>
                </ul>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-red-600">✖ 결재/반려 불가</div>
              </td>
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                  시행자
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-900">
                  결재 완료 후 실행 담당자
                </div>
              </td>
              <td className="px-6 py-4">
                <ul className="text-sm text-gray-700 list-disc list-inside space-y-1">
                  <li>실행 처리 버튼 활성화</li>
                  <li>실행 결과 보고</li>
                  <li>첨부파일 업로드</li>
                </ul>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-red-600">
                  ✖ 결재/의견 작성 불가
                </div>
              </td>
            </tr>
            <tr className="bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                  참조자
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-900">
                  알림 및 정보 공유 대상자
                </div>
              </td>
              <td className="px-6 py-4">
                <ul className="text-sm text-gray-700 list-disc list-inside space-y-1">
                  <li>문서 열람</li>
                  <li>알림 수신</li>
                </ul>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-red-600">
                  ✖ 결재 / 협의 / 실행 불가
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="bg-green-50 border-l-4 border-green-400 p-4 mt-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-green-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-green-700">
              <strong>협의 프로세스 규칙:</strong> 결재는 반드시 협의자 모두가
              &apos;협의 완료&apos; 후에 가능하도록 설정 가능합니다(필수 여부
              선택 가능).
            </p>
          </div>
        </div>
      </div>

      {/* UX 시나리오 예시 */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          활용 예시: 지출 결의 문서
        </h3>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="space-y-3">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-sm">
                  1
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-700">
                  <strong>작성자:</strong> 지출 결의서 작성, 협의자로 회계
                  담당자 지정
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600 font-semibold text-sm">
                  2
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-700">
                  <strong>협의자:</strong> 회계 담당자가 세부 검토 후 협의 완료
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-sm">
                  3
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-700">
                  <strong>결재자:</strong> 부서장 → 본부장 순서로 결재
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-semibold text-sm">
                  4
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-700">
                  <strong>시행자:</strong> 총무 담당자가 실제 지출 실행 후 시행
                  완료 처리
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-semibold text-sm">
                  5
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-700">
                  <strong>참조자:</strong> CFO에게 완료 알림 자동 발송
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 문서 상태
function StatusSection() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">문서 상태</h2>
        <p className="text-gray-700 mb-6">
          문서의 라이프사이클 동안 거치는 각 상태와 전환 조건을 설명합니다.
        </p>
      </div>

      <div className="space-y-4">
        <div className="border-l-4 border-gray-400 bg-gray-50 p-4 rounded-r-lg">
          <div className="flex items-center mb-2">
            <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-gray-100 text-gray-800 mr-3">
              DRAFT
            </span>
            <span className="text-lg font-semibold text-gray-900">
              임시저장
            </span>
          </div>
          <p className="text-gray-700 mb-2">
            문서가 작성 중이며 아직 제출되지 않은 상태입니다.
          </p>
          <div className="text-sm text-gray-600">
            <p>
              <strong>가능한 작업:</strong> 수정, 삭제, 제출
            </p>
            <p className="mt-1">
              <strong>다음 상태:</strong> PENDING (제출 시)
            </p>
          </div>
        </div>

        <div className="border-l-4 border-yellow-400 bg-yellow-50 p-4 rounded-r-lg">
          <div className="flex items-center mb-2">
            <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 mr-3">
              PENDING
            </span>
            <span className="text-lg font-semibold text-gray-900">
              결재 대기
            </span>
          </div>
          <p className="text-gray-700 mb-2">
            문서가 제출되어 결재가 진행 중인 상태입니다. 결재선이 스냅샷으로
            고정되며, 협의자 협의가 필요한 경우 협의 프로세스가 먼저 진행됩니다.
          </p>
          <div className="text-sm text-gray-600">
            <p>
              <strong>가능한 작업:</strong> 협의자 협의 완료, 결재자 승인/반려,
              작성자 취소
            </p>
            <p className="mt-1">
              <strong>다음 상태:</strong> APPROVED (모든 결재 완료), REJECTED
              (반려), CANCELLED (취소)
            </p>
          </div>
        </div>

        <div className="border-l-4 border-green-400 bg-green-50 p-4 rounded-r-lg">
          <div className="flex items-center mb-2">
            <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-green-100 text-green-800 mr-3">
              APPROVED
            </span>
            <span className="text-lg font-semibold text-gray-900">
              결재 완료
            </span>
          </div>
          <p className="text-gray-700 mb-2">
            모든 결재자가 승인하여 결재가 완료된 상태입니다.
          </p>
          <div className="text-sm text-gray-600">
            <p>
              <strong>가능한 작업:</strong> 시행자 실행 처리
            </p>
            <p className="mt-1">
              <strong>다음 상태:</strong> IMPLEMENTED (시행 완료)
            </p>
          </div>
        </div>

        <div className="border-l-4 border-red-400 bg-red-50 p-4 rounded-r-lg">
          <div className="flex items-center mb-2">
            <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-red-100 text-red-800 mr-3">
              REJECTED
            </span>
            <span className="text-lg font-semibold text-gray-900">반려</span>
          </div>
          <p className="text-gray-700 mb-2">
            결재자가 문서를 반려한 상태입니다. 반려 사유가 기록됩니다.
          </p>
          <div className="text-sm text-gray-600">
            <p>
              <strong>가능한 작업:</strong> 작성자가 수정 후 재제출
            </p>
            <p className="mt-1">
              <strong>다음 상태:</strong> DRAFT (재작성 시)
            </p>
          </div>
        </div>

        <div className="border-l-4 border-gray-400 bg-gray-50 p-4 rounded-r-lg">
          <div className="flex items-center mb-2">
            <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-gray-100 text-gray-800 mr-3">
              CANCELLED
            </span>
            <span className="text-lg font-semibold text-gray-900">취소</span>
          </div>
          <p className="text-gray-700 mb-2">
            작성자가 결재 진행 중인 문서를 취소한 상태입니다.
          </p>
          <div className="text-sm text-gray-600">
            <p>
              <strong>가능한 작업:</strong> 열람만 가능
            </p>
            <p className="mt-1">
              <strong>다음 상태:</strong> 종료 (변경 불가)
            </p>
          </div>
        </div>

        <div className="border-l-4 border-blue-400 bg-blue-50 p-4 rounded-r-lg">
          <div className="flex items-center mb-2">
            <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mr-3">
              IMPLEMENTED
            </span>
            <span className="text-lg font-semibold text-gray-900">
              시행 완료
            </span>
          </div>
          <p className="text-gray-700 mb-2">
            결재 완료 후 시행자가 실제 업무를 수행하고 완료한 상태입니다.
          </p>
          <div className="text-sm text-gray-600">
            <p>
              <strong>가능한 작업:</strong> 열람만 가능
            </p>
            <p className="mt-1">
              <strong>다음 상태:</strong> 종료 (최종 완료)
            </p>
          </div>
        </div>
      </div>

      {/* 상태 전환 다이어그램 */}
      <div className="mt-8 bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          상태 전환 다이어그램
        </h3>
        <div className="flex flex-col items-center space-y-4">
          <div className="flex items-center space-x-4">
            <div className="px-4 py-2 bg-gray-100 rounded-lg font-medium text-sm">
              DRAFT
            </div>
            <div className="text-gray-400">→</div>
            <div className="px-4 py-2 bg-yellow-100 rounded-lg font-medium text-sm">
              PENDING
            </div>
            <div className="text-gray-400">→</div>
            <div className="px-4 py-2 bg-green-100 rounded-lg font-medium text-sm">
              APPROVED
            </div>
            <div className="text-gray-400">→</div>
            <div className="px-4 py-2 bg-blue-100 rounded-lg font-medium text-sm">
              IMPLEMENTED
            </div>
          </div>
          <div className="text-center text-sm text-gray-600">(정상 흐름)</div>

          <div className="mt-4 space-y-2 text-sm text-gray-600">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-red-100 rounded mr-2"></div>
              <span>
                PENDING → <strong>REJECTED</strong> (결재자 반려 시)
              </span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-gray-100 rounded mr-2"></div>
              <span>
                PENDING → <strong>CANCELLED</strong> (작성자 취소 시)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
