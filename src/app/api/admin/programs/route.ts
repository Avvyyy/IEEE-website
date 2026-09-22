import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/app/api/admin/_guard";
import { dbGetPrograms, dbCreateProgram } from "@/lib/db";
export const dynamic = "force-dynamic";
export async function GET() {
  const guard = await requireAdmin(); if (guard) return guard;
  try { return NextResponse.json(await dbGetPrograms()); } catch (e) { return NextResponse.json({ error: String(e) }, { status: 500 }); }
}
export async function POST(request: NextRequest) {
  const guard = await requireAdmin(); if (guard) return guard;
  try { const body = await request.json(); return NextResponse.json(await dbCreateProgram(body), { status: 201 }); } catch (e) { return NextResponse.json({ error: String(e) }, { status: 500 }); }
}
