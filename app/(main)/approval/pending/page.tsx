import { getToken } from "@/lib/auth-server";
import { approvalProcessService } from "@/services/approval-process.service";
import PendingApprovalsClient from "./pending-client";

export default async function PendingApprovalsPage() {
  const token = await getToken();

  if (!token) {
    return null;
  }

  try {
    const pendingApprovals = await approvalProcessService.fetchMyPending(token);

    return (
      <PendingApprovalsClient
        initialApprovals={
          Array.isArray(pendingApprovals) ? pendingApprovals : []
        }
        token={token}
      />
    );
  } catch (error) {
    console.error("Error fetching pending approvals:", error);
    return <PendingApprovalsClient initialApprovals={[]} token={token} />;
  }
}
