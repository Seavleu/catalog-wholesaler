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

// User type for auth
export type UserEntity = {
  id: string;
  phone?: string;
  email?: string;
  full_name?: string;
  role?: "admin" | "manager" | "user";
  created_date?: string;
};

// Base44 client that mirrors the SDK patterns used in components
export const base44 = {
  auth: {
    me: async (): Promise<UserEntity | null> => {
      // For now return a mock admin user for development
      // In production, implement proper auth flow
      return {
        id: "dev-user",
        full_name: "Developer",
        email: "dev@example.com",
        role: "admin",
      };
    },
    logout: () => {
      // Implement logout logic
      if (typeof window !== "undefined") {
        window.location.href = "/";
      }
    },
  },
  entities: {
    Product: {
      list: async (sort?: string): Promise<ProductEntity[]> => {
        const products = await fetchProductEntities();
        if (sort === "-created_date") {
          return products.reverse();
        }
        return products;
      },
      create: async (data: Partial<ProductEntity>): Promise<ProductEntity> => {
        const response = await fetch(
          `${BASE44_BASE_URL}/${BASE44_APP_ID}/entities/Product`,
          {
            method: "POST",
            headers: {
              api_key: BASE44_API_KEY,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          }
        );
        if (!response.ok) throw new Error("Failed to create product");
        return response.json();
      },
      update: updateProductEntity,
      delete: async (id: string): Promise<void> => {
        const response = await fetch(
          `${BASE44_BASE_URL}/${BASE44_APP_ID}/entities/Product/${id}`,
          {
            method: "DELETE",
            headers: {
              api_key: BASE44_API_KEY,
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) throw new Error("Failed to delete product");
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
        // Mock users for development
        return [
          {
            id: "1",
            full_name: "Admin User",
            phone: "012345678",
            role: "admin",
            created_date: new Date().toISOString(),
          },
        ];
      },
      create: async (data: Partial<UserEntity>): Promise<UserEntity> => {
        // Mock create - in production wire to your auth backend
        return {
          id: Math.random().toString(36).slice(2),
          ...data,
          created_date: new Date().toISOString(),
        } as UserEntity;
      },
      delete: async (id: string): Promise<void> => {
        // Mock delete
        console.log("Delete user:", id);
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
        // For development, return a placeholder or implement actual upload
        // In production, wire this to your file upload endpoint
        return {
          file_url: URL.createObjectURL(file),
        };
      },
    },
  },
};

export type { ProductEntity, ReviewEntity };

