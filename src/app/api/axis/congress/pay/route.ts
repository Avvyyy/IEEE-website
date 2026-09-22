import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { supabase } from "@/lib/supabase";
import { initializePayment, generatePaymentReference } from "@/lib/paystack";

const DAY3_AMOUNT_KOBO = 400_000; // ₦4,000

const schema = z.object({
  registrationId: z.string().uuid(),
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
      { error: "Invalid registration ID." },
      { status: 400 }
    );
  }

  const { registrationId } = parsed.data;

  // Look up the registration
  const { data: reg, error: regError } = await supabase
    .from("axis_congress_registrations")
    .select("id, email, name, attending_day3, payment_status")
    .eq("id", registrationId)
    .single();

  if (regError || !reg) {
    return NextResponse.json(
      { error: "Registration not found." },
      { status: 404 }
    );
  }

  if (!reg.attending_day3) {
    return NextResponse.json(
      { error: "Day 3 was not selected for this registration." },
      { status: 400 }
    );
  }

  if (reg.payment_status === "paid") {
    return NextResponse.json(
      { error: "Day 3 payment has already been completed." },
      { status: 400 }
    );
  }

  // Initialize Paystack transaction
  const reference = generatePaymentReference();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3100";
  const callbackUrl = `${siteUrl}/api/axis/congress/pay/verify`;

  try {
    const result = await initializePayment({
      email: reg.email,
      amount: DAY3_AMOUNT_KOBO,
      reference,
      callback_url: callbackUrl,
      metadata: {
        registration_id: registrationId,
        event: "AXIS Congress 2026 — Day 3 Field Trip",
        name: reg.name,
      },
    });

    // Update registration with reference
    await supabase
      .from("axis_congress_registrations")
      .update({
        paystack_reference: reference,
        payment_amount: DAY3_AMOUNT_KOBO,
      })
      .eq("id", registrationId);

    return NextResponse.json({
      ok: true,
      authorization_url: result.data.authorization_url,
      access_code: result.data.access_code,
      reference: result.data.reference,
    });
  } catch (err) {
    console.error("[axis/congress/pay] Paystack error:", err);
    return NextResponse.json(
      { error: "Could not initialize payment. Please try again." },
      { status: 500 }
    );
  }
}
