interface DocumentStatusBadgeProps {
  status: string;
  className?: string;
}

export const DocumentStatusBadge = ({
  status,
  className = "",
}: DocumentStatusBadgeProps) => {
  const getStatusConfig = (status: string) => {
    switch (status.toUpperCase()) {
      case "PENDING":
        return {
          label: "결재중",
          className: "bg-warning/10 text-warning",
        };
      case "APPROVED":
        return {
          label: "승인",
          className: "bg-success/10 text-success",
        };
      case "REJECTED":
        return {
          label: "반려",
          className: "bg-danger/10 text-danger",
        };
      case "DRAFT":
        return {
          label: "작성중",
          className: "bg-secondary/10 text-secondary",
        };
      case "CANCELLED":
        return {
          label: "취소",
          className: "bg-gray-100 text-gray-600",
        };
      default:
        return {
          label: status,
          className: "bg-gray-100 text-gray-600",
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <span
      className={`px-2 py-1 text-xs font-medium rounded-full ${config.className} ${className}`}
    >
      {config.label}
    </span>
  );
};
