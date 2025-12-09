import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabaseClient";
import { ProductEntity } from "@/lib/types";
import {
  extractFilePathFromUrl,
  extractImagePathsFromProduct,
  isSupabaseStorageUrl,
} from "@/lib/storageUtils";

type Params = { params: { id: string } };

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
    
    // Delete old images that are no longer referenced (only Supabase storage images)
    if (currentProduct) {
      const oldImages: string[] = [];
      const newImages: string[] = [];
      
      // Collect old images (only from Supabase storage)
      if (currentProduct.cover_image && isSupabaseStorageUrl(currentProduct.cover_image)) {
        const path = extractFilePathFromUrl(currentProduct.cover_image);
        if (path) oldImages.push(path);
      }
      if (currentProduct.catalog_images && Array.isArray(currentProduct.catalog_images)) {
        currentProduct.catalog_images.forEach((img: string) => {
          if (isSupabaseStorageUrl(img)) {
            const path = extractFilePathFromUrl(img);
            if (path) oldImages.push(path);
          }
        });
      }
      
      // Collect new images (only from Supabase storage)
      if (body.cover_image && isSupabaseStorageUrl(body.cover_image)) {
        const path = extractFilePathFromUrl(body.cover_image);
        if (path) newImages.push(path);
      }
      if (body.catalog_images && Array.isArray(body.catalog_images)) {
        body.catalog_images.forEach((img: string) => {
          if (isSupabaseStorageUrl(img)) {
            const path = extractFilePathFromUrl(img);
            if (path) newImages.push(path);
          }
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
          console.warn(
            `Failed to delete ${imagesToDelete.length} old image(s) from storage:`,
            storageError
          );
        } else {
          console.log(
            `Successfully deleted ${imagesToDelete.length} old image(s) from storage for product ${params.id}`
          );
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
    
    // Delete associated images from storage if product exists (only Supabase storage images)
    if (product) {
      // Only extract paths from Supabase storage URLs
      const filesToDelete: string[] = [];
      
      if (product.cover_image && isSupabaseStorageUrl(product.cover_image)) {
        const path = extractFilePathFromUrl(product.cover_image);
        if (path) filesToDelete.push(path);
      }
      
      if (product.catalog_images && Array.isArray(product.catalog_images)) {
        product.catalog_images.forEach((imgUrl: string) => {
          if (isSupabaseStorageUrl(imgUrl)) {
            const path = extractFilePathFromUrl(imgUrl);
            if (path) filesToDelete.push(path);
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
          console.warn(
            `Failed to delete ${filesToDelete.length} image(s) from storage:`,
            storageError
          );
        } else {
          console.log(
            `Successfully deleted ${filesToDelete.length} image(s) from storage for product ${params.id}`
          );
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

