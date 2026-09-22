import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { verifyPayment } from "@/lib/paystack";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const reference = searchParams.get("reference") ?? searchParams.get("trxref");

  if (!reference) {
    return NextResponse.redirect(
      new URL("/axis-congress?payment=error", request.url)
    );
  }

  try {
    const result = await verifyPayment(reference);

    if (result.data.status === "success") {
      // Update registration record
      const metadata = result.data.metadata as Record<string, unknown>;
      const registrationId = metadata?.registration_id as string | undefined;

      if (registrationId) {
        await supabase
          .from("axis_congress_registrations")
          .update({
            payment_status: "paid",
            paystack_reference: reference,
            payment_amount: result.data.amount,
            payment_verified_at: new Date().toISOString(),
          })
          .eq("id", registrationId);
      } else {
        // Fallback: find by reference
        await supabase
          .from("axis_congress_registrations")
          .update({
            payment_status: "paid",
            payment_amount: result.data.amount,
            payment_verified_at: new Date().toISOString(),
          })
          .eq("paystack_reference", reference);
      }

      return NextResponse.redirect(
        new URL("/axis-congress?payment=success", request.url)
      );
    }

    return NextResponse.redirect(
      new URL("/axis-congress?payment=failed", request.url)
    );
  } catch (err) {
    console.error("[axis/congress/pay/verify] Verification error:", err);
    return NextResponse.redirect(
      new URL("/axis-congress?payment=error", request.url)
    );
  }
}
