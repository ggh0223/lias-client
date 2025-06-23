export default function DraftPage() {
  return (
    <div className="space-y-6">
      {/* 페이지 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">상신함</h1>
          <p className="text-secondary mt-1">내가 기안한 문서들을 확인하세요</p>
        </div>
        <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
          새 문서 작성
        </button>
      </div>

      {/* 필터 및 검색 */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="문서 제목 또는 번호로 검색"
            className="w-full px-4 py-2 border border-border rounded-lg bg-surface text-primary placeholder:text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        <select className="px-4 py-2 border border-border rounded-lg bg-surface text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
          <option value="">전체 상태</option>
          <option value="draft">작성중</option>
          <option value="pending">결재중</option>
          <option value="approved">승인</option>
          <option value="rejected">반려</option>
        </select>
        <select className="px-4 py-2 border border-border rounded-lg bg-surface text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
          <option value="">전체 양식</option>
          <option value="vacation">휴가 신청서</option>
          <option value="purchase">구매 요청서</option>
          <option value="business-trip">출장 신청서</option>
        </select>
      </div>

      {/* 문서 목록 */}
      <div className="bg-surface border border-border rounded-lg">
        <div className="p-6 border-b border-border">
          <h2 className="text-lg font-semibold text-primary">기안 문서 목록</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-surface/50 border-b border-border">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">
                  문서 번호
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">
                  제목
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">
                  양식
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">
                  상태
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">
                  기안일
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">
                  액션
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr className="hover:bg-surface/50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary">
                  DOC-2024-001
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-primary">
                      휴가 신청서
                    </div>
                    <div className="text-sm text-secondary">
                      2024년 1월 휴가 신청
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary">
                  휴가 신청서
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs font-medium bg-warning/10 text-warning rounded-full">
                    결재중
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary">
                  2024.01.15
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-primary hover:text-primary/80 mr-3">
                    보기
                  </button>
                  <button className="text-secondary hover:text-primary">
                    수정
                  </button>
                </td>
              </tr>
              <tr className="hover:bg-surface/50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary">
                  DOC-2024-002
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-primary">
                      구매 요청서
                    </div>
                    <div className="text-sm text-secondary">
                      개발 장비 구매 요청
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary">
                  구매 요청서
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs font-medium bg-success/10 text-success rounded-full">
                    승인
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary">
                  2024.01.14
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-primary hover:text-primary/80">
                    보기
                  </button>
                </td>
              </tr>
              <tr className="hover:bg-surface/50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary">
                  DOC-2024-003
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-primary">
                      출장 신청서
                    </div>
                    <div className="text-sm text-secondary">
                      고객사 방문 출장
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary">
                  출장 신청서
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs font-medium bg-danger/10 text-danger rounded-full">
                    반려
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary">
                  2024.01.13
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-primary hover:text-primary/80 mr-3">
                    보기
                  </button>
                  <button className="text-secondary hover:text-primary">
                    재상신
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 페이지네이션 */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-secondary">총 3개 문서 중 1-3 표시</div>
        <div className="flex items-center space-x-2">
          <button className="px-3 py-1 border border-border rounded text-sm text-secondary hover:bg-surface disabled:opacity-50">
            이전
          </button>
          <button className="px-3 py-1 bg-primary text-white rounded text-sm">
            1
          </button>
          <button className="px-3 py-1 border border-border rounded text-sm text-secondary hover:bg-surface disabled:opacity-50">
            다음
          </button>
        </div>
      </div>
    </div>
  );
}
