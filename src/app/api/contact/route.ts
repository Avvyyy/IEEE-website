import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { addSubmission } from "@/lib/content";

const contactSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200),
  subject: z.string().trim().min(2).max(200),
  message: z.string().trim().min(10).max(5000),
  // Honeypot field: real users never fill this in.
  company: z.string().max(0).optional().default(""),
});

export async function POST(request: NextRequest) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check your form details and try again." },
      { status: 400 }
    );
  }

  const { name, email, subject, message } = parsed.data;
  const submission = await addSubmission({ name, email, subject, message });

  const webhook = process.env.CONTACT_WEBHOOK_URL;
  if (webhook) {
    try {
      await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message }),
      });
    } catch {
      // Forwarding is best-effort; the submission is already persisted above.
    }
  }

  return NextResponse.json({ ok: true, id: submission.id });
}
