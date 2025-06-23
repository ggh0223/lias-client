export default function CategoriesPage() {
  return (
    <div className="space-y-6">
      {/* 페이지 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">문서 분류 관리</h1>
          <p className="text-secondary mt-1">
            문서 타입과 카테고리를 관리하세요
          </p>
        </div>
        <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
          분류 생성
        </button>
      </div>

      {/* 검색 및 필터 */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="분류명으로 검색"
            className="w-full px-4 py-2 border border-border rounded-lg bg-surface text-primary placeholder:text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        <select className="px-4 py-2 border border-border rounded-lg bg-surface text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
          <option value="">전체 레벨</option>
          <option value="1">1단계</option>
          <option value="2">2단계</option>
          <option value="3">3단계</option>
        </select>
        <select className="px-4 py-2 border border-border rounded-lg bg-surface text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
          <option value="">전체 상태</option>
          <option value="active">활성</option>
          <option value="inactive">비활성</option>
        </select>
      </div>

      {/* 분류 목록 */}
      <div className="bg-surface border border-border rounded-lg">
        <div className="p-6 border-b border-border">
          <h2 className="text-lg font-semibold text-primary">문서 분류 목록</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-surface/50 border-b border-border">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">
                  분류명
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">
                  설명
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">
                  레벨
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">
                  상위 분류
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">
                  상태
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">
                  문서 수
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">
                  생성일
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">
                  액션
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr className="hover:bg-surface/50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-primary">인사</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-secondary">
                    인사 관련 문서 분류
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
                    1단계
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary">
                  -
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs font-medium bg-success/10 text-success rounded-full">
                    활성
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary">
                  15개
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary">
                  2024.01.01
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-primary hover:text-primary/80 mr-3">
                    보기
                  </button>
                  <button className="text-secondary hover:text-primary mr-3">
                    수정
                  </button>
                  <button className="text-danger hover:text-danger/80">
                    삭제
                  </button>
                </td>
              </tr>
              <tr className="hover:bg-surface/50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-primary">휴가</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-secondary">
                    휴가 관련 문서 분류
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs font-medium bg-warning/10 text-warning rounded-full">
                    2단계
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary">
                  인사
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs font-medium bg-success/10 text-success rounded-full">
                    활성
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary">
                  8개
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary">
                  2024.01.02
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-primary hover:text-primary/80 mr-3">
                    보기
                  </button>
                  <button className="text-secondary hover:text-primary mr-3">
                    수정
                  </button>
                  <button className="text-danger hover:text-danger/80">
                    삭제
                  </button>
                </td>
              </tr>
              <tr className="hover:bg-surface/50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-primary">구매</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-secondary">
                    구매 관련 문서 분류
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs font-medium bg-info/10 text-info rounded-full">
                    1단계
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary">
                  -
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs font-medium bg-success/10 text-success rounded-full">
                    활성
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary">
                  12개
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary">
                  2024.01.03
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-primary hover:text-primary/80 mr-3">
                    보기
                  </button>
                  <button className="text-secondary hover:text-primary mr-3">
                    수정
                  </button>
                  <button className="text-danger hover:text-danger/80">
                    삭제
                  </button>
                </td>
              </tr>
              <tr className="hover:bg-surface/50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-primary">업무</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-secondary">
                    일반 업무 관련 문서 분류
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs font-medium bg-secondary/10 text-secondary rounded-full">
                    1단계
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary">
                  -
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs font-medium bg-success/10 text-success rounded-full">
                    활성
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary">
                  20개
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary">
                  2024.01.04
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-primary hover:text-primary/80 mr-3">
                    보기
                  </button>
                  <button className="text-secondary hover:text-primary mr-3">
                    수정
                  </button>
                  <button className="text-danger hover:text-danger/80">
                    삭제
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 페이지네이션 */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-secondary">총 4개 분류 중 1-4 표시</div>
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
