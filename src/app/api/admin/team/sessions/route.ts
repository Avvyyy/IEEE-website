import { NextResponse } from "next/server";
import { requireAdmin } from "@/app/api/admin/_guard";
import { dbGetTeamSessions } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const guard = await requireAdmin();
  if (guard) return guard;
  try {
    const sessions = await dbGetTeamSessions();
    return NextResponse.json(sessions);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
