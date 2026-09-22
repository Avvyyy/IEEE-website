import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/app/api/admin/_guard";
import { dbGetTeamMembers, dbCreateTeamMember } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const guard = await requireAdmin();
  if (guard) return guard;
  try {
    const { searchParams } = new URL(request.url);
    const session = searchParams.get("session") ?? undefined;
    const members = await dbGetTeamMembers(session);
    return NextResponse.json(members);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const guard = await requireAdmin();
  if (guard) return guard;
  try {
    const body = await request.json();
    const member = await dbCreateTeamMember(body);
    return NextResponse.json(member, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
