/**
 * paystack.ts — Server-side Paystack API helpers.
 * Uses the Paystack Secret Key for transaction initialization and verification.
 */

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY;
const PAYSTACK_BASE = "https://api.paystack.co";

if (!PAYSTACK_SECRET) {
  console.warn("[paystack] PAYSTACK_SECRET_KEY is not set. Payments will not work.");
}

// ─── Types ────────────────────────────────────────────────────────────────

export interface PaystackInitializeResponse {
  status: boolean;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

export interface PaystackVerifyResponse {
  status: boolean;
  message: string;
  data: {
    id: number;
    domain: string;
    status: string;
    reference: string;
    amount: number;
    message: string | null;
    gateway_response: string;
    paid_at: string;
    created_at: string;
    channel: string;
    currency: string;
    metadata: Record<string, unknown>;
    authorization: {
      authorization_code: string;
      bin: string;
      last4: string;
      exp_month: string;
      exp_year: string;
      channel: string;
      card_type: string;
      bank: string;
      reusable: boolean;
    };
    customer: {
      id: number;
      email: string;
      customer_code: string;
    };
  };
}

// ─── Initialize Transaction ───────────────────────────────────────────────

export async function initializePayment(opts: {
  email: string;
  amount: number; // in kobo
  reference: string;
  callback_url: string;
  metadata?: Record<string, unknown>;
}): Promise<PaystackInitializeResponse> {
  const res = await fetch(`${PAYSTACK_BASE}/transaction/initialize`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: opts.email,
      amount: opts.amount,
      reference: opts.reference,
      callback_url: opts.callback_url,
      metadata: opts.metadata ?? {},
    }),
  });

  const data = await res.json();
  if (!res.ok || !data.status) {
    throw new Error(data.message ?? "Paystack initialization failed");
  }
  return data;
}

// ─── Verify Transaction ───────────────────────────────────────────────────

export async function verifyPayment(
  reference: string
): Promise<PaystackVerifyResponse> {
  const res = await fetch(`${PAYSTACK_BASE}/transaction/verify/${reference}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET}`,
    },
  });

  const data = await res.json();
  if (!res.ok || !data.status) {
    throw new Error(data.message ?? "Paystack verification failed");
  }
  return data;
}

// ─── Generate unique reference ────────────────────────────────────────────

export function generatePaymentReference(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `AXIS-D3-${timestamp}-${random}`.toUpperCase();
}
