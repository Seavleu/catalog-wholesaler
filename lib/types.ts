export type UserRole = "admin" | "manager" | "user";

export type UserEntity = {
  id: string;
  phone?: string;
  email?: string;
  full_name?: string;
  role?: UserRole;
  created_date?: string;
};

export type ProductEntity = {
  id: string;
  name?: string;
  brand?: string;
  category?: string;
  cover_image?: string;
  catalog_images?: string[];
  sizes?: string[];
  colors?: string[];
  color_count?: number; // Total number of colors available (may be more than images)
  stock_status?: "in_stock" | "low_stock" | "out_of_stock" | "restocking";
  restock_date?: string | null;
  notes?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
  created_date?: string; // backward compat for mocks
};

