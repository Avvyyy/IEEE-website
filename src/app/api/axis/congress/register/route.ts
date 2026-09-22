import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { supabase } from "@/lib/supabase";
import { sendCongressConfirmation } from "@/lib/resend";

const schema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200),
  school: z.string().trim().min(2).max(200),
  course: z.string().trim().min(2).max(200),
  level: z.enum(["100L", "200L", "300L", "400L", "500L", "Postgraduate"]),
  attendingDay3: z.boolean().default(false),
  // Honeypot
  company: z.string().max(0).optional().default(""),
});

export async function POST(request: NextRequest) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check your details and try again." },
      { status: 400 }
    );
  }

  const { name, email, school, course, level, attendingDay3 } = parsed.data;

  // Persist to Supabase
  const { data: reg, error: dbError } = await supabase
    .from("axis_congress_registrations")
    .insert({ name, email, school, course, level, attending_day3: attendingDay3 })
    .select("id")
    .single();

  if (dbError) {
    console.error("[axis/congress/register] Supabase error:", dbError);
    return NextResponse.json(
      { error: "Registration could not be saved. Please try again later." },
      { status: 500 }
    );
  }

  const paystackUrl = process.env.NEXT_PUBLIC_PAYSTACK_DAY3_URL ?? "";

  // Send confirmation email (non-fatal if it fails)
  try {
    await sendCongressConfirmation({ to: email, name, attendingDay3, paystackUrl });
  } catch (emailErr) {
    console.error("[axis/congress/register] Email send error:", emailErr);
  }

  return NextResponse.json({
    ok: true,
    registrationId: reg.id,
    attendingDay3,
    paystackUrl: attendingDay3 ? paystackUrl : null,
  });
}
