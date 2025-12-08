import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabaseClient";
import { ProductEntity } from "@/lib/base44Api";

type Params = { params: { id: string } };

/**
 * Extracts the file path from a Supabase Storage public URL
 * Example: https://xxx.supabase.co/storage/v1/object/public/product-images/products/file.jpg
 * Returns: products/file.jpg
 */
function extractFilePathFromUrl(url: string): string | null {
  try {
    const urlObj = new URL(url);
    // Extract path after /public/product-images/
    const match = urlObj.pathname.match(/\/storage\/v1\/object\/public\/product-images\/(.+)$/);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

export async function PUT(req: Request, { params }: Params) {
  try {
    const body = (await req.json()) as Partial<ProductEntity>;
    const supabase = getServiceSupabase();
    
    // Fetch current product to compare images
    const { data: currentProduct } = await supabase
      .from("products")
      .select("cover_image, catalog_images")
      .eq("id", params.id)
      .single();
    
    // Update the product
    const { data, error } = await supabase
      .from("products")
      .update({
        ...body,
        updated_at: new Date().toISOString(),
      })
      .eq("id", params.id)
      .select()
      .single();
    if (error) throw error;
    
    // Delete old images that are no longer referenced
    if (currentProduct) {
      const oldImages: string[] = [];
      const newImages: string[] = [];
      
      // Collect old images
      if (currentProduct.cover_image) {
        const path = extractFilePathFromUrl(currentProduct.cover_image);
        if (path) oldImages.push(path);
      }
      if (currentProduct.catalog_images && Array.isArray(currentProduct.catalog_images)) {
        currentProduct.catalog_images.forEach((img: string) => {
          const path = extractFilePathFromUrl(img);
          if (path) oldImages.push(path);
        });
      }
      
      // Collect new images
      if (body.cover_image) {
        const path = extractFilePathFromUrl(body.cover_image);
        if (path) newImages.push(path);
      }
      if (body.catalog_images && Array.isArray(body.catalog_images)) {
        body.catalog_images.forEach((img: string) => {
          const path = extractFilePathFromUrl(img);
          if (path) newImages.push(path);
        });
      }
      
      // Find images that are no longer used
      const imagesToDelete = oldImages.filter((img) => !newImages.includes(img));
      
      // Delete unused images from storage
      if (imagesToDelete.length > 0) {
        const { error: storageError } = await supabase.storage
          .from("product-images")
          .remove(imagesToDelete);
        
        // Log storage errors but don't fail the update operation
        if (storageError) {
          console.warn("Some old images could not be deleted from storage:", storageError);
        }
      }
    }
    
    return NextResponse.json(data as ProductEntity);
  } catch (err: any) {
    console.error("products PUT failed", err);
    return NextResponse.json(
      { error: err?.message || "Failed to update product" },
      { status: 500 }
    );
  }
}

export async function DELETE(_: Request, { params }: Params) {
  try {
    const supabase = getServiceSupabase();
    
    // First, fetch the product to get image URLs
    const { data: product, error: fetchError } = await supabase
      .from("products")
      .select("cover_image, catalog_images")
      .eq("id", params.id)
      .single();
    
    if (fetchError && fetchError.code !== "PGRST116") {
      // PGRST116 is "not found" - that's okay, product might already be deleted
      throw fetchError;
    }
    
    // Delete associated images from storage if product exists
    if (product) {
      const filesToDelete: string[] = [];
      
      // Extract cover image path
      if (product.cover_image) {
        const coverPath = extractFilePathFromUrl(product.cover_image);
        if (coverPath) {
          filesToDelete.push(coverPath);
        }
      }
      
      // Extract catalog image paths
      if (product.catalog_images && Array.isArray(product.catalog_images)) {
        product.catalog_images.forEach((imgUrl: string) => {
          const imgPath = extractFilePathFromUrl(imgUrl);
          if (imgPath) {
            filesToDelete.push(imgPath);
          }
        });
      }
      
      // Delete files from storage
      if (filesToDelete.length > 0) {
        const { error: storageError } = await supabase.storage
          .from("product-images")
          .remove(filesToDelete);
        
        // Log storage errors but don't fail the delete operation
        // (in case files were already deleted or don't exist)
        if (storageError) {
          console.warn("Some files could not be deleted from storage:", storageError);
        }
      }
    }
    
    // Delete the product from database
    const { error } = await supabase.from("products").delete().eq("id", params.id);
    if (error) throw error;
    
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("products DELETE failed", err);
    return NextResponse.json(
      { error: err?.message || "Failed to delete product" },
      { status: 500 }
    );
  }
}

