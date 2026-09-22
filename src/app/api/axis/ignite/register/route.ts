import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { supabase } from "@/lib/supabase";
import { sendIgniteConfirmation } from "@/lib/resend";
import { getAxis } from "@/lib/content";

const schema = z.object({
  webinarId: z.string().min(1),
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200),
  school: z.string().trim().min(2).max(200),
  course: z.string().trim().min(2).max(200),
  level: z.enum(["100L", "200L", "300L", "400L", "500L", "Postgraduate"]),
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

  const { webinarId, name, email, school, course, level } = parsed.data;

  // Persist to Supabase
  const { error: dbError } = await supabase
    .from("axis_ignite_registrations")
    .insert({ webinar_id: webinarId, name, email, school, course, level });

  if (dbError) {
    console.error("[axis/ignite/register] Supabase error:", dbError);
    return NextResponse.json(
      { error: "Registration could not be saved. Please try again later." },
      { status: 500 }
    );
  }

  // Look up webinar details for the confirmation email
  try {
    const axis = await getAxis();
    const webinar = axis.ignite.webinars.find((w) => w.id === webinarId);
    if (webinar) {
      await sendIgniteConfirmation({
        to: email,
        name,
        webinarTitle: webinar.title,
        weekNumber: webinar.week,
        date: webinar.date,
        time: webinar.time,
      });
    }
  } catch (emailErr) {
    // Email failure is non-fatal — registration is already saved
    console.error("[axis/ignite/register] Email send error:", emailErr);
  }

  return NextResponse.json({ ok: true });
}
