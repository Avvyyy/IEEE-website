import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { addNewsletterSignup } from "@/lib/content";

const schema = z.object({ email: z.string().trim().email().max(200) });

export async function POST(request: NextRequest) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  await addNewsletterSignup(parsed.data.email);
  return NextResponse.json({ ok: true });
}
