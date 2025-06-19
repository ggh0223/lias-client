import { Text, Surface } from "lumir-design-system-shared";
import { Button } from "lumir-design-system-02";

export default function Home() {
  return (
    <div className="animate-fade-in">
      {/* 헤더 섹션 */}
      <div className="mb-8">
        <Text
          variant="hero-1"
          weight="bold"
          className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4"
        >
          LIAS 전자결재 시스템
        </Text>
        <Text
          variant="body-1"
          color="secondary-system01-2-rest"
          className="max-w-2xl"
        >
          효율적이고 투명한 전자결재 프로세스로 업무를 혁신하세요. 실시간 승인
          상태 확인과 스마트한 워크플로우로 업무 효율성을 극대화합니다.
        </Text>
      </div>

      {/* 통계 카드 섹션 */}
      <div className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: "대기 중인 결재",
              value: "12",
              icon: "⏳",
              color: "from-orange-400 to-red-400",
            },
            {
              title: "진행 중인 문서",
              value: "8",
              icon: "📝",
              color: "from-blue-400 to-cyan-400",
            },
            {
              title: "완료된 결재",
              value: "156",
              icon: "✅",
              color: "from-green-400 to-emerald-400",
            },
            {
              title: "전체 문서",
              value: "1,234",
              icon: "📊",
              color: "from-purple-400 to-pink-400",
            },
          ].map((stat, index) => (
            <Surface
              key={index}
              background="secondary-system01-inverse-rest"
              boxShadow="20"
              className="p-6 rounded-2xl hover-lift transition-smooth group cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div>
                  <Text
                    variant="caption-1"
                    color="secondary-system01-2-rest"
                    className="mb-2"
                  >
                    {stat.title}
                  </Text>
                  <Text
                    variant="title-1"
                    weight="bold"
                    className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
                  >
                    {stat.value}
                  </Text>
                </div>
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center text-white text-xl shadow-lg group-hover:scale-110 transition-transform duration-300`}
                >
                  <Text variant="body-1" className="text-xl">
                    {stat.icon}
                  </Text>
                </div>
              </div>
            </Surface>
          ))}
        </div>
      </div>

      {/* 빠른 액션 섹션 */}
      <div className="mb-8">
        <Text
          variant="title-2"
          weight="medium"
          className="mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
        >
          빠른 액션
        </Text>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "새 결재 작성",
              description: "새로운 전자결재 문서를 작성합니다",
              icon: "✍️",
              href: "/documents/new",
            },
            {
              title: "결재선 관리",
              description: "결재선을 설정하고 관리합니다",
              icon: "👥",
              href: "/approval-lines",
            },
            {
              title: "양식 관리",
              description: "문서 양식을 생성하고 관리합니다",
              icon: "📋",
              href: "/document-forms",
            },
          ].map((action, index) => (
            <Button
              key={index}
              variant="transparent"
              colorScheme="primary"
              onClick={() => (window.location.href = action.href)}
              className="h-auto p-6 rounded-2xl hover-lift transition-smooth group text-left"
            >
              <div className="flex flex-col items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Text variant="body-1" className="text-xl">
                    {action.icon}
                  </Text>
                </div>
                <div>
                  <Text
                    variant="heading-3"
                    weight="medium"
                    className="mb-2 group-hover:text-blue-600 transition-colors duration-200"
                  >
                    {action.title}
                  </Text>
                  <Text variant="body-2" color="secondary-system01-2-rest">
                    {action.description}
                  </Text>
                </div>
              </div>
            </Button>
          ))}
        </div>
      </div>

      {/* 최근 활동 섹션 */}
      <div>
        <Text
          variant="title-2"
          weight="medium"
          className="mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
        >
          최근 활동
        </Text>
        <Surface
          background="secondary-system01-inverse-rest"
          boxShadow="20"
          className="p-6 rounded-2xl"
        >
          <div className="space-y-4">
            {[
              {
                action: "휴가 신청서",
                status: "승인됨",
                time: "2시간 전",
                icon: "✅",
              },
              {
                action: "구매 요청서",
                status: "검토 중",
                time: "4시간 전",
                icon: "⏳",
              },
              {
                action: "출장 신청서",
                status: "반려됨",
                time: "1일 전",
                icon: "❌",
              },
              {
                action: "교육 신청서",
                status: "승인됨",
                time: "2일 전",
                icon: "✅",
              },
            ].map((activity, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors duration-200"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center text-lg">
                  <Text variant="body-1" className="text-lg">
                    {activity.icon}
                  </Text>
                </div>
                <div className="flex-1">
                  <Text variant="body-2" weight="medium" className="mb-1">
                    {activity.action}
                  </Text>
                  <Text variant="caption-1" color="secondary-system01-2-rest">
                    {activity.time}
                  </Text>
                </div>
                <div
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    activity.status === "승인됨"
                      ? "bg-green-100 text-green-700"
                      : activity.status === "검토 중"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  <Text variant="caption-2" weight="medium">
                    {activity.status}
                  </Text>
                </div>
              </div>
            ))}
          </div>
        </Surface>
      </div>
    </div>
  );
}
