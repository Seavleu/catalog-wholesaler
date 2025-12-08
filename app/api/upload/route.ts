import { NextRequest, NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabaseClient";

const BUCKET_NAME = "product-images";
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/jpg"];

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only JPEG and PNG are allowed." },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File size exceeds 5MB limit" },
        { status: 400 }
      );
    }

    const supabase = getServiceSupabase();

    // Generate unique filename
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `products/${fileName}`;

    // Convert File to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      // If bucket doesn't exist, try to create it
      if (error.message.includes("Bucket not found")) {
        const { error: bucketError } = await supabase.storage.createBucket(
          BUCKET_NAME,
          {
            public: true,
            allowedMimeTypes: ALLOWED_TYPES,
            fileSizeLimit: MAX_FILE_SIZE,
          }
        );

        if (bucketError) {
          console.error("Failed to create bucket:", bucketError);
          return NextResponse.json(
            { error: "Failed to create storage bucket. Please create it manually in Supabase dashboard." },
            { status: 500 }
          );
        }

        // Retry upload after creating bucket
        const { data: retryData, error: retryError } = await supabase.storage
          .from(BUCKET_NAME)
          .upload(filePath, buffer, {
            contentType: file.type,
            upsert: false,
          });

        if (retryError) {
          console.error("Upload failed after bucket creation:", retryError);
          return NextResponse.json(
            { error: retryError.message || "Failed to upload file" },
            { status: 500 }
          );
        }

        // Get public URL
        const { data: urlData } = supabase.storage
          .from(BUCKET_NAME)
          .getPublicUrl(filePath);

        return NextResponse.json({
          file_url: urlData.publicUrl,
        });
      }

      console.error("Upload failed:", error);
      return NextResponse.json(
        { error: error.message || "Failed to upload file" },
        { status: 500 }
      );
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath);

    return NextResponse.json({
      file_url: urlData.publicUrl,
    });
  } catch (err: any) {
    console.error("Upload error:", err);
    return NextResponse.json(
      { error: err?.message || "Failed to upload file" },
      { status: 500 }
    );
  }
}

