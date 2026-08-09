import { NextResponse } from "next/server";
import { getSubmissions } from "@/lib/content";

export async function GET() {
  const submissions = await getSubmissions();
  return NextResponse.json({ data: submissions });
}
