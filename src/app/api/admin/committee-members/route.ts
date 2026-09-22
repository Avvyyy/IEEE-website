import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/app/api/admin/_guard";
import { dbGetCommitteeMembers, dbCreateCommitteeMember } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const guard = await requireAdmin();
  if (guard) return guard;
  const subcommitteeId = request.nextUrl.searchParams.get("subcommittee_id") ?? undefined;
  try {
    return NextResponse.json(await dbGetCommitteeMembers(subcommitteeId));
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const guard = await requireAdmin();
  if (guard) return guard;
  try {
    const body = await request.json();
    return NextResponse.json(await dbCreateCommitteeMember(body), { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
