import { getToken, getUser } from "@/lib/auth-server";
import { apiClient } from "@/lib/api-client";
import DashboardClient from "./dashboard-client";

export default async function DashboardPage() {
  const token = await getToken();
  const user = await getUser();

  if (!token || !user) {
    return null;
  }

  try {
    // 내 결재 대기 목록
    const pendingApprovals = await apiClient.getMyPendingApprovals(token);

    // 내 문서 목록
    const myDocuments = await apiClient.getMyDocuments(token);

    // 통계 데이터 계산
    const stats = {
      pendingApprovals: Array.isArray(pendingApprovals)
        ? pendingApprovals.length
        : 0,
      myDocuments: Array.isArray(myDocuments) ? myDocuments.length : 0,
      draftDocuments: Array.isArray(myDocuments)
        ? myDocuments.filter((doc) => doc.status === "DRAFT").length
        : 0,
      pendingDocuments: Array.isArray(myDocuments)
        ? myDocuments.filter((doc) => doc.status === "PENDING").length
        : 0,
    };

    return (
      <DashboardClient
        user={user}
        stats={stats}
        pendingApprovals={
          Array.isArray(pendingApprovals) ? pendingApprovals.slice(0, 5) : []
        }
        recentDocuments={
          Array.isArray(myDocuments) ? myDocuments.slice(0, 5) : []
        }
      />
    );
  } catch (error) {
    console.error("Dashboard data fetch error:", error);
    return (
      <DashboardClient
        user={user}
        stats={{
          pendingApprovals: 0,
          myDocuments: 0,
          draftDocuments: 0,
          pendingDocuments: 0,
        }}
        pendingApprovals={[]}
        recentDocuments={[]}
      />
    );
  }
}
