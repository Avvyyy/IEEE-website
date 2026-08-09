import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { FILE_MAP, getRawContent, saveRawContent } from "@/lib/content";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ type: string }> }
) {
  const { type } = await params;
  if (!FILE_MAP[type]) {
    return NextResponse.json({ error: "Unknown content type" }, { status: 404 });
  }
  try {
    const data = await getRawContent(type);
    return NextResponse.json({ data });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to read content" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ type: string }> }
) {
  const { type } = await params;
  if (!FILE_MAP[type]) {
    return NextResponse.json({ error: "Unknown content type" }, { status: 404 });
  }
  try {
    const body = await request.json();
    await saveRawContent(type, body.data);
    // Content is read at request time on statically-optimized pages;
    // bust the whole site cache so edits show up immediately.
    revalidatePath("/", "layout");
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to save content" },
      { status: 500 }
    );
  }
}
