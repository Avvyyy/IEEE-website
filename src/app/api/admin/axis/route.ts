import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/app/api/admin/_guard";
import { dbGetAxisCongress, dbUpsertAxisCongress } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const guard = await requireAdmin();
  if (guard) return guard;
  try {
    const congress = await dbGetAxisCongress();
    return NextResponse.json(congress);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const guard = await requireAdmin();
  if (guard) return guard;
  try {
    const body = await request.json();
    const congress = await dbUpsertAxisCongress(body);
    return NextResponse.json(congress);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
