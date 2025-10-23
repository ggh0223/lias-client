"use client";

import { useState, useRef, useEffect } from "react";
import { apiClient } from "@/lib/api-client";
import { clientAuth } from "@/lib/auth-client";

interface TestDataScenario {
  value: string;
  label: string;
  description: string;
  emoji: string;
}

const TEST_DATA_SCENARIOS: TestDataScenario[] = [
  {
    value: "SIMPLE_APPROVAL",
    label: "간단한 결재",
    description: "기안자 → 부서장 → 본부장 → 완료",
    emoji: "✅",
  },
  {
    value: "MULTI_LEVEL_APPROVAL",
    label: "복잡한 다단계 결재",
    description: "기안자 → 팀장 → 부서장 → 본부장 → 완료",
    emoji: "🔄",
  },
  {
    value: "AGREEMENT_PROCESS",
    label: "협의 프로세스",
    description: "기안자 → 협의자 2명 동시 검토 → 부서장 → 완료",
    emoji: "🤝",
  },
  {
    value: "IMPLEMENTATION_PROCESS",
    label: "시행 프로세스",
    description: "기안자 → 부서장 → 시행자 실행 → 완료",
    emoji: "⚙️",
  },
  {
    value: "REJECTED_DOCUMENT",
    label: "반려된 문서",
    description: "기안자 → 부서장 반려 → REJECTED 상태",
    emoji: "❌",
  },
  {
    value: "CANCELLED_DOCUMENT",
    label: "취소된 문서",
    description: "기안자 → 진행 중 기안자가 취소 → CANCELLED 상태",
    emoji: "🚫",
  },
  {
    value: "WITH_REFERENCE",
    label: "참조자 포함",
    description: "기안자 → 결재 진행 → 참조자들에게 알림",
    emoji: "👥",
  },
  {
    value: "PARALLEL_AGREEMENT",
    label: "병렬 협의",
    description: "기안자 → 여러 부서 동시 협의 → 최종 승인",
    emoji: "🔀",
  },
  {
    value: "FULL_PROCESS",
    label: "전체 프로세스",
    description: "기안자 → 협의 → 결재 → 시행 → 참조 (모든 단계 포함)",
    emoji: "🎯",
  },
  {
    value: "NO_APPROVAL_LINE",
    label: "결재선 없는 양식",
    description: "결재선이 없는 양식으로 문서 생성 (자동 결재선 생성 테스트)",
    emoji: "🔧",
  },
];

export default function TestDataManager() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedScenario, setSelectedScenario] =
    useState<string>("SIMPLE_APPROVAL");
  const [documentCount, setDocumentCount] = useState<number>(1);
  const [titlePrefix, setTitlePrefix] = useState<string>("테스트 문서");
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleCreateTestData = async () => {
    if (!selectedScenario) return;

    setIsLoading(true);
    try {
      const token = clientAuth.getToken();
      if (!token) {
        alert("로그인이 필요합니다.");
        return;
      }

      const response = await apiClient.createTestData(token, {
        scenario: selectedScenario,
        documentCount,
        titlePrefix,
        progress: 0,
      });

      if (response.success) {
        const documentCount = response.data?.documents?.length || 0;
        const formCount = response.data?.forms?.length || 0;
        const templateCount = response.data?.approvalLineTemplates?.length || 0;

        alert(
          `테스트 데이터가 생성되었습니다!\n\n` +
            `📄 생성된 문서: ${documentCount}개\n` +
            `📋 생성된 양식: ${formCount}개\n` +
            `📌 생성된 결재선 템플릿: ${templateCount}개`
        );
      } else {
        alert(`테스트 데이터 생성 실패: ${response.message}`);
      }
      setIsOpen(false);
    } catch (error) {
      console.error("테스트 데이터 생성 실패:", error);
      alert("테스트 데이터 생성에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAllTestData = async () => {
    if (
      !confirm(
        "⚠️ 모든 테스트 데이터를 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다!"
      )
    ) {
      return;
    }

    setIsLoading(true);
    try {
      const token = clientAuth.getToken();
      if (!token) {
        alert("로그인이 필요합니다.");
        return;
      }

      const response = await apiClient.deleteAllTestData(token);

      if (response.success) {
        const deletedCount = response.data?.deletedCount || 0;
        alert(
          `모든 테스트 데이터가 삭제되었습니다!\n삭제된 항목 수: ${deletedCount}개`
        );
      } else {
        alert(`테스트 데이터 삭제 실패: ${response.message}`);
      }
    } catch (error) {
      console.error("테스트 데이터 삭제 실패:", error);
      alert("테스트 데이터 삭제에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
      >
        🧪 테스트 데이터
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-96 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              테스트 데이터 관리
            </h3>

            {/* 시나리오 선택 */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                시나리오 선택
              </label>
              <select
                value={selectedScenario}
                onChange={(e) => setSelectedScenario(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {TEST_DATA_SCENARIOS.map((scenario) => (
                  <option key={scenario.value} value={scenario.value}>
                    {scenario.emoji} {scenario.label}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                {
                  TEST_DATA_SCENARIOS.find((s) => s.value === selectedScenario)
                    ?.description
                }
              </p>
            </div>

            {/* 문서 개수 */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                문서 개수
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={documentCount}
                onChange={(e) =>
                  setDocumentCount(parseInt(e.target.value) || 1)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* 제목 접두사 */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                제목 접두사
              </label>
              <input
                type="text"
                value={titlePrefix}
                onChange={(e) => setTitlePrefix(e.target.value)}
                placeholder="예: 지출 결의서"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* 버튼들 */}
            <div className="flex space-x-2">
              <button
                onClick={handleCreateTestData}
                disabled={isLoading}
                className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                {isLoading ? "생성 중..." : "📄 테스트 데이터 생성"}
              </button>

              <button
                onClick={handleDeleteAllTestData}
                disabled={isLoading}
                className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                {isLoading ? "삭제 중..." : "🗑️ 전체 삭제"}
              </button>
            </div>

            <div className="mt-3 text-xs text-gray-500">
              ⚠️ 개발/테스트 환경에서만 사용하세요
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
