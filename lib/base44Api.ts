export const BASE44_APP_ID = "692bf3c8349da3ff615290e3";
export const BASE44_API_KEY = "992ddf25dee2456e916794cbd4399325";
export const BASE44_BASE_URL = "https://app.base44.com/api/apps";

export type ProductEntity = {
  id: string;
  name?: string;
  brand?: string;
  category?: string;
  cover_image?: string;
  catalog_images?: string[];
  sizes?: string[];
  colors?: string[];
  stock_status?: "in_stock" | "low_stock" | "out_of_stock" | "restocking";
  restock_date?: string | null;
  notes?: string;
  is_active?: boolean;
};

export type ReviewEntity = {
  id: string;
  product_id: string;
  rating: number;
  text?: string;
  reviewer_name?: string;
  status?: string;
};

async function base44Fetch<TResponse>(
  entity: "Product" | "Review",
  init?: RequestInit
): Promise<TResponse> {
  const url = `${BASE44_BASE_URL}/${BASE44_APP_ID}/entities/${entity}`;

  const response = await fetch(url, {
    ...init,
    headers: {
      "api_key": BASE44_API_KEY,
      "Content-Type": "application/json",
      ...(init?.headers || {})
    }
  });

  if (!response.ok) {
    throw new Error(`Base44 ${entity} request failed with ${response.status}`);
  }

  return response.json() as Promise<TResponse>;
}

export async function fetchProductEntities(): Promise<ProductEntity[]> {
  return base44Fetch<ProductEntity[]>("Product");
}

export async function updateProductEntity(
  entityId: string,
  updateData: Partial<ProductEntity>
): Promise<ProductEntity> {
  const url = `${BASE44_BASE_URL}/${BASE44_APP_ID}/entities/Product/${entityId}`;

  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "api_key": BASE44_API_KEY,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(updateData)
  });

  if (!response.ok) {
    throw new Error(`Base44 Product update failed with ${response.status}`);
  }

  return response.json() as Promise<ProductEntity>;
}

export async function fetchReviewEntities(): Promise<ReviewEntity[]> {
  return base44Fetch<ReviewEntity[]>("Review");
}

export async function updateReviewEntity(
  entityId: string,
  updateData: Partial<ReviewEntity>
): Promise<ReviewEntity> {
  const url = `${BASE44_BASE_URL}/${BASE44_APP_ID}/entities/Review/${entityId}`;

  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "api_key": BASE44_API_KEY,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(updateData)
  });

  if (!response.ok) {
    throw new Error(`Base44 Review update failed with ${response.status}`);
  }

  return response.json() as Promise<ReviewEntity>;
}


