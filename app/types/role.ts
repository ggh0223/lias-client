export type UserRole = "USER" | "ADMIN";

export type Role = {
  id: string;
  name: string;
  type: UserRole;
};

export const isAdmin = (role: UserRole): boolean => {
  return role === "ADMIN";
};
