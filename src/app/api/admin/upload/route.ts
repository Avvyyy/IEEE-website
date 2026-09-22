import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/app/api/admin/_guard";
import { uploadFile } from "@/lib/storage";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const guard = await requireAdmin();
  if (guard) return guard;
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }
    const url = await uploadFile(file, file.name);
    return NextResponse.json({ url });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
