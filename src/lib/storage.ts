/**
 * storage.ts — server-side file upload to Supabase Storage.
 * Accepts a File/Blob and returns the public URL.
 */

import { supabase } from "./supabase";

const BUCKET = "admin-uploads";

export async function uploadFile(
  file: File | Blob,
  fileName: string
): Promise<string> {
  const ext = fileName.split(".").pop() ?? "bin";
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, {
      contentType: file instanceof File ? file.type : "application/octet-stream",
      upsert: false,
    });

  if (error) throw error;

  const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return urlData.publicUrl;
}

export async function deleteFile(url: string): Promise<void> {
  // Extract path from public URL
  const marker = `/object/public/${BUCKET}/`;
  const idx = url.indexOf(marker);
  if (idx === -1) return;
  const path = url.slice(idx + marker.length);
  const { error } = await supabase.storage.from(BUCKET).remove([path]);
  if (error) console.warn("[storage] delete failed:", error.message);
}
