import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/app/api/admin/_guard";
import { dbGetSubcommittees, dbCreateSubcommittee } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const guard = await requireAdmin();
  if (guard) return guard;
  const programId = request.nextUrl.searchParams.get("program_id") ?? undefined;
  try {
    return NextResponse.json(await dbGetSubcommittees(programId));
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const guard = await requireAdmin();
  if (guard) return guard;
  try {
    const body = await request.json();
    return NextResponse.json(await dbCreateSubcommittee(body), { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
