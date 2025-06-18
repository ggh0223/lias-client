import { useState, useEffect } from "react";
import { UserRole } from "../types/role";

// 임시 사용자 역할 데이터 (실제로는 API에서 가져와야 함)
const mockUserRole: UserRole = "ADMIN";

export const useAuth = () => {
  const [userRole, setUserRole] = useState<UserRole | null>(mockUserRole);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 실제 구현에서는 API 호출로 대체
    const fetchUserRole = async () => {
      try {
        // API 호출 대신 임시 데이터 사용
        setUserRole(mockUserRole);
      } catch (error) {
        console.error("Failed to fetch user role:", error);
        setUserRole(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserRole();
  }, []);

  const isAdmin = (): boolean => {
    return userRole === "ADMIN";
  };

  return {
    userRole,
    isLoading,
    isAdmin,
    setUserRole,
  };
};
