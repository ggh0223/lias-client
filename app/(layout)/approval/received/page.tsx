export default function ReceivedPage() {
  return (
    <div className="space-y-6">
      {/* 페이지 헤더 */}
      <div>
        <h1 className="text-2xl font-bold text-primary">수신참조함</h1>
        <p className="text-secondary mt-1">수신/참조한 문서들을 확인하세요</p>
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
          <option value="">전체 역할</option>
          <option value="receiver">수신자</option>
          <option value="reference">참조자</option>
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
          <h2 className="text-lg font-semibold text-primary">수신/참조 문서</h2>
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
                  기안자
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">
                  양식
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">
                  역할
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">
                  상태
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">
                  수신일
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">
                  액션
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr className="hover:bg-surface/50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary">
                  DOC-2024-010
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-primary">
                      교육 신청서
                    </div>
                    <div className="text-sm text-secondary">
                      웹 개발 과정 교육 신청
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary">
                  김영희
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary">
                  교육 신청서
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs font-medium bg-info/10 text-info rounded-full">
                    수신자
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs font-medium bg-warning/10 text-warning rounded-full">
                    진행중
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary">
                  2024.01.15
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-primary hover:text-primary/80">
                    보기
                  </button>
                </td>
              </tr>
              <tr className="hover:bg-surface/50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary">
                  DOC-2024-011
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-primary">
                      장비 대여 신청서
                    </div>
                    <div className="text-sm text-secondary">
                      노트북 대여 신청
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary">
                  박민수
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary">
                  장비 대여 신청서
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs font-medium bg-secondary/10 text-secondary rounded-full">
                    참조자
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs font-medium bg-success/10 text-success rounded-full">
                    완료
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
                  DOC-2024-012
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-primary">
                      회의실 예약 신청서
                    </div>
                    <div className="text-sm text-secondary">
                      프로젝트 회의실 예약
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary">
                  이지은
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary">
                  회의실 예약 신청서
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs font-medium bg-info/10 text-info rounded-full">
                    수신자
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs font-medium bg-success/10 text-success rounded-full">
                    완료
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary">
                  2024.01.13
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-primary hover:text-primary/80">
                    보기
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
