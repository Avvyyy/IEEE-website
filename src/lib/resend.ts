import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;
const from = process.env.RESEND_FROM_EMAIL ?? "noreply@ieeebabcock.org";

if (!apiKey) {
  console.warn(
    "[resend] RESEND_API_KEY is not set. Confirmation emails will not be sent."
  );
}

export const resend = new Resend(apiKey ?? "");

/* ------------------------------------------------------------------ */
/*  AXIS Ignite — per-webinar confirmation email                       */
/* ------------------------------------------------------------------ */
export async function sendIgniteConfirmation(opts: {
  to: string;
  name: string;
  webinarTitle: string;
  weekNumber: number;
  date: string;
  time: string;
}) {
  if (!apiKey) return;

  const { to, name, webinarTitle, weekNumber, date, time } = opts;

  await resend.emails.send({
    from,
    to,
    subject: `You're registered! AXIS Ignite Week ${weekNumber} — ${webinarTitle}`,
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>AXIS Ignite Registration Confirmed</title>
</head>
<body style="margin:0;padding:0;background:#060d1f;font-family:'Inter',Arial,sans-serif;color:#cbd5e1;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#060d1f;padding:40px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#0c1529;border-radius:16px;overflow:hidden;border:1px solid rgba(255,255,255,0.08);">

        <!-- Header bar -->
        <tr>
          <td style="background:#00629B;padding:24px 32px;">
            <p style="margin:0;font-size:12px;letter-spacing:3px;color:#9ec7ec;text-transform:uppercase;font-weight:600;">IEEE Babcock Student Branch</p>
            <h1 style="margin:8px 0 0;font-size:24px;color:#ffffff;font-weight:700;">AXIS Ignite</h1>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:32px;">
            <p style="font-size:16px;color:#ffffff;margin:0 0 16px;">Hi ${name},</p>
            <p style="margin:0 0 24px;line-height:1.7;">
              You're registered for <strong style="color:#ffffff;">AXIS Ignite Week ${weekNumber}</strong>. We're excited to have you join us!
            </p>

            <!-- Event card -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#142038;border-radius:12px;border:1px solid rgba(255,255,255,0.08);margin-bottom:28px;">
              <tr>
                <td style="padding:8px 20px;background:#FFA300;border-radius:12px 12px 0 0;">
                  <span style="font-size:11px;font-weight:700;color:#060d1f;letter-spacing:2px;text-transform:uppercase;">Week ${weekNumber}</span>
                </td>
              </tr>
              <tr>
                <td style="padding:20px;">
                  <p style="margin:0 0 6px;font-size:18px;font-weight:700;color:#ffffff;">${webinarTitle}</p>
                  <p style="margin:0 0 4px;font-size:14px;color:#9ec7ec;">📅 ${date !== "TBC" ? date : "Date to be announced"}</p>
                  <p style="margin:0;font-size:14px;color:#9ec7ec;">🕐 ${time !== "TBC" ? time : "Time to be announced"}</p>
                </td>
              </tr>
            </table>

            <p style="margin:0 0 24px;line-height:1.7;font-size:14px;">
              We'll send you the webinar link closer to the date. Keep an eye on your inbox and our social channels for updates.
            </p>

            <p style="margin:0;line-height:1.7;font-size:14px;">
              See you there,<br/>
              <strong style="color:#ffffff;">IEEE Babcock Student Branch</strong>
            </p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:20px 32px;border-top:1px solid rgba(255,255,255,0.08);">
            <p style="margin:0;font-size:12px;color:#4b5563;text-align:center;">
              IEEE Babcock University Student Branch · Babcock University, Ilishan-Remo, Ogun State
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`,
  });
}

/* ------------------------------------------------------------------ */
/*  AXIS Congress — full-congress confirmation email                   */
/* ------------------------------------------------------------------ */
export async function sendCongressConfirmation(opts: {
  to: string;
  name: string;
  attendingDay3: boolean;
  paystackUrl?: string;
}) {
  if (!apiKey) return;

  const { to, name, attendingDay3 } = opts;

  const day3Block = attendingDay3
    ? `
    <!-- Day 3 notice -->
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#1a1608;border-radius:12px;border:1px solid rgba(255,163,0,0.3);margin-bottom:28px;">
      <tr>
        <td style="padding:20px;">
          <p style="margin:0 0 8px;font-size:14px;font-weight:700;color:#FFA300;">⚡ Day 3 — Field Trip (Paid Event)</p>
          <p style="margin:0 0 16px;font-size:14px;line-height:1.6;color:#cbd5e1;">
            You selected Day 3 (Field Trip — November 12). Your spot will be fully confirmed only after payment of ₦4,000 is received. After registration, you will be redirected to complete payment via Paystack.
          </p>
          <p style="margin:0 0 16px;font-size:14px;line-height:1.6;color:#cbd5e1;">
            If you haven&apos;t completed payment yet, you can do so from the congress page.
          </p>
        </td>
      </tr>
    </table>`
    : "";

  await resend.emails.send({
    from,
    to,
    subject: "You're registered for AXIS Congress 2026 🎉",
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>AXIS Congress Registration Confirmed</title>
</head>
<body style="margin:0;padding:0;background:#060d1f;font-family:'Inter',Arial,sans-serif;color:#cbd5e1;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#060d1f;padding:40px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#0c1529;border-radius:16px;overflow:hidden;border:1px solid rgba(255,255,255,0.08);">

        <!-- Header bar -->
        <tr>
          <td style="background:linear-gradient(135deg,#00629B,#009CA6);padding:24px 32px;">
            <p style="margin:0;font-size:12px;letter-spacing:3px;color:#9ec7ec;text-transform:uppercase;font-weight:600;">IEEE Babcock Student Branch</p>
            <h1 style="margin:8px 0 4px;font-size:28px;color:#ffffff;font-weight:700;">AXIS Congress 2026</h1>
            <p style="margin:0;font-size:14px;color:#9ec7ec;">Engineering the Next Frontier</p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:32px;">
            <p style="font-size:16px;color:#ffffff;margin:0 0 16px;">Hi ${name} 🎉</p>
            <p style="margin:0 0 24px;line-height:1.7;">
              You're registered for <strong style="color:#ffffff;">AXIS Congress 2026</strong> — IEEE Babcock Student Branch's flagship annual technology congress. We can't wait to see you there!
            </p>

            <!-- Event details -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#142038;border-radius:12px;border:1px solid rgba(255,255,255,0.08);margin-bottom:24px;">
              <tr>
                <td style="padding:20px;">
              <p style="margin:0 0 8px;font-size:14px;color:#9ec7ec;">📅 <strong style="color:#ffffff;">November 10–12, 2026</strong></p>
              <p style="margin:0 0 8px;font-size:14px;color:#9ec7ec;">📍 <strong style="color:#ffffff;">Babcock University, Ilishan-Remo, Ogun State</strong></p>
              <p style="margin:0;font-size:14px;color:#9ec7ec;">🏷 <strong style="color:#ffffff;">A.X.I.S. — Advancement, eXploration, Innovation, Skills</strong></p>
                </td>
              </tr>
            </table>

            ${day3Block}

            <p style="margin:0 0 24px;line-height:1.7;font-size:14px;">
              More details — including venue maps, programme schedule, and joining instructions — will be sent closer to the event. Stay connected on our social channels for updates.
            </p>

            <p style="margin:0;line-height:1.7;font-size:14px;">
              See you in November,<br/>
              <strong style="color:#ffffff;">IEEE Babcock Student Branch</strong>
            </p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:20px 32px;border-top:1px solid rgba(255,255,255,0.08);">
            <p style="margin:0;font-size:12px;color:#4b5563;text-align:center;">
              IEEE Babcock University Student Branch · Babcock University, Ilishan-Remo, Ogun State
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`,
  });
}
