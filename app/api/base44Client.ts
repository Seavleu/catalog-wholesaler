"use client";

import {
  BASE44_APP_ID,
  BASE44_API_KEY,
  BASE44_BASE_URL,
  ProductEntity,
  ReviewEntity,
  fetchProductEntities,
  updateProductEntity,
  fetchReviewEntities,
  updateReviewEntity,
} from "@/lib/base44Api";
import { getBrowserSupabase } from "@/lib/supabaseClient";
import { UserEntity } from "@/lib/types";
import { normalizePhoneToE164 } from "@/lib/phoneUtils";

type UserCreatePayload = Partial<UserEntity> & { password?: string };

// Base44 client that mirrors the SDK patterns used in components
export const base44 = {
  auth: {
    login: async ({
      email,
      phone,
      password,
    }: {
      email?: string;
      phone?: string;
      password: string;
    }): Promise<UserEntity | null> => {
      const supabase = getBrowserSupabase();
      if (!supabase) throw new Error("Supabase env vars missing");
      
      // Use email if provided, otherwise use phone (normalize phone to E.164)
      const { data, error } = await supabase.auth.signInWithPassword({
        ...(email ? { email } : { phone: normalizePhoneToE164(phone!) }),
        password,
      });
      if (error) throw error;
      if (!data.user) return null;
      const role =
        (data.user.user_metadata?.role as UserEntity["role"]) || "user";
      return {
        id: data.user.id,
        email: data.user.email || undefined,
        phone: data.user.phone || undefined,
        full_name:
          (data.user.user_metadata?.full_name as string | undefined) ||
          data.user.email ||
          data.user.phone ||
          undefined,
        role,
        created_date: data.user.created_at,
      };
    },
    me: async (): Promise<UserEntity | null> => {
      const supabase = getBrowserSupabase();
      if (!supabase) return null;

      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) {
        return null;
      }

      const user = data.user;
      const role = (user.user_metadata?.role as UserEntity["role"]) || "user";

      return {
        id: user.id,
        email: user.email || undefined,
        phone: user.phone || undefined,
        full_name:
          (user.user_metadata?.full_name as string | undefined) ||
          user.email ||
          user.phone ||
          undefined,
        role,
        created_date: user.created_at,
      };
    },
    logout: () => {
      const supabase = getBrowserSupabase();
      if (supabase) {
        supabase.auth.signOut().catch((err) =>
          console.error("Logout failed:", err)
        );
      }
      if (typeof window !== "undefined") window.location.href = "/";
    },
  },
  entities: {
    Product: {
      list: async (sort?: string): Promise<ProductEntity[]> => {
        const url = `/api/products${sort ? `?sort=${encodeURIComponent(sort)}` : ""}`;
        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch products");
        const products: ProductEntity[] = await res.json();
        if (sort === "-created_date") {
          const getCreated = (p: ProductEntity) =>
            new Date(p.created_at || p.created_date || 0).getTime();
          return [...products].sort((a, b) => getCreated(b) - getCreated(a));
        }
        return products;
      },
      create: async (data: Partial<ProductEntity>): Promise<ProductEntity> => {
        const res = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error || "Failed to create product");
        }
        return res.json();
      },
      update: async (
        id: string,
        data: Partial<ProductEntity>
      ): Promise<ProductEntity> => {
        const res = await fetch(`/api/products/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error || "Failed to update product");
        }
        return res.json();
      },
      delete: async (id: string): Promise<void> => {
        const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error || "Failed to delete product");
        }
      },
    },
    Review: {
      list: async (sort?: string): Promise<ReviewEntity[]> => {
        const reviews = await fetchReviewEntities();
        if (sort === "-created_date") {
          return reviews.reverse();
        }
        return reviews;
      },
      create: async (data: Partial<ReviewEntity>): Promise<ReviewEntity> => {
        const response = await fetch(
          `${BASE44_BASE_URL}/${BASE44_APP_ID}/entities/Review`,
          {
            method: "POST",
            headers: {
              api_key: BASE44_API_KEY,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          }
        );
        if (!response.ok) throw new Error("Failed to create review");
        return response.json();
      },
      update: updateReviewEntity,
      delete: async (id: string): Promise<void> => {
        const response = await fetch(
          `${BASE44_BASE_URL}/${BASE44_APP_ID}/entities/Review/${id}`,
          {
            method: "DELETE",
            headers: {
              api_key: BASE44_API_KEY,
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) throw new Error("Failed to delete review");
      },
    },
    User: {
      list: async (sort?: string): Promise<UserEntity[]> => {
        const url = `/api/users${sort ? `?sort=${encodeURIComponent(sort)}` : ""}`;
        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch users");
        return res.json();
      },
      create: async (data: UserCreatePayload): Promise<UserEntity> => {
        const res = await fetch("/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error || "Failed to create user");
        }
        return res.json();
      },
      delete: async (id: string): Promise<void> => {
        const res = await fetch(`/api/users/${id}`, {
          method: "DELETE",
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error || "Failed to delete user");
        }
      },
    },
  },
  integrations: {
    Core: {
      UploadFile: async ({
        file,
      }: {
        file: File;
      }): Promise<{ file_url: string }> => {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error || "Failed to upload file");
        }

        const data = await res.json();
        return { file_url: data.file_url };
      },
    },
  },
};

export type { ProductEntity, ReviewEntity };
