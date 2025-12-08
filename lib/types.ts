export type UserRole = "admin" | "manager" | "user";

export type UserEntity = {
  id: string;
  phone?: string;
  email?: string;
  full_name?: string;
  role?: UserRole;
  created_date?: string;
};

