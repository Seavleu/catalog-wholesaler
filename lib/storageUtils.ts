/**
 * Utility functions for managing Supabase Storage files
 */

const BUCKET_NAME = "product-images";

/**
 * Extracts the file path from a Supabase Storage public URL
 * Example: https://xxx.supabase.co/storage/v1/object/public/product-images/products/file.jpg
 * Returns: products/file.jpg
 */
export function extractFilePathFromUrl(url: string): string | null {
  try {
    const urlObj = new URL(url);
    // Extract path after /public/product-images/
    const match = urlObj.pathname.match(/\/storage\/v1\/object\/public\/product-images\/(.+)$/);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

/**
 * Extracts all file paths from product image URLs
 */
export function extractImagePathsFromProduct(product: {
  cover_image?: string | null;
  catalog_images?: string[] | null;
}): string[] {
  const paths: string[] = [];
  
  if (product.cover_image) {
    const path = extractFilePathFromUrl(product.cover_image);
    if (path) paths.push(path);
  }
  
  if (product.catalog_images && Array.isArray(product.catalog_images)) {
    product.catalog_images.forEach((imgUrl: string) => {
      const path = extractFilePathFromUrl(imgUrl);
      if (path) paths.push(path);
    });
  }
  
  return paths;
}

/**
 * Checks if a URL is from Supabase Storage
 */
export function isSupabaseStorageUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    return urlObj.pathname.includes("/storage/v1/object/public/product-images/");
  } catch {
    return false;
  }
}

