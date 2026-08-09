import { NextResponse } from "next/server";
import { getNewsletterSignups } from "@/lib/content";

export async function GET() {
  const signups = await getNewsletterSignups();
  return NextResponse.json({ data: signups });
}
