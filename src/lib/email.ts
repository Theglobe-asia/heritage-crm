// src/lib/email.ts
import { Resend } from "resend";

const API_KEY = process.env.RESEND_API_KEY;
const FROM_NAME = process.env.EMAIL_FROM_NAME || "The Globe Heritage";
const FROM_ADDR = process.env.EMAIL_FROM_ADDRESS || "noreply@updates.theglobeasia.com";

if (!API_KEY) {
  // Fail early so you see the real cause, not EAUTH from SMTP
  console.error("❌ Missing RESEND_API_KEY in env");
}

const resend = new Resend(API_KEY);

/**
 * Send a single email via Resend
 */
export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  const from = `${FROM_NAME} <${FROM_ADDR}>`;

  const { error } = await resend.emails.send({
    from,
    to,
    subject,
    html,
  });

  if (error) throw error;
}

/**
 * Send to many recipients one-by-one to keep tracking/reporting clean
 */
export async function sendBulk({
  to,
  subject,
  html,
}: {
  to: string[];
  subject: string;
  html: string;
}) {
  for (const addr of to) {
    await sendEmail({ to: addr, subject, html });
  }
}

/**
 * Simple campaign HTML with your tagline + What's New! button
 */
export function buildCampaignHtml({
  title,
  message,
}: {
  title: string;
  message: string;
}) {
  return `
  <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;line-height:1.6;color:#111;background:#fff;padding:16px;">
    <h2 style="color:#f3c969;margin:0 0 8px 0">${escapeHtml(title)}</h2>
    <div style="white-space:pre-wrap">${escapeHtml(message)}</div>

    <div style="margin:18px 0">
      <a href="https://theglobeasia.com"
         style="display:inline-block;padding:10px 16px;background:#f3c969;color:#000;border-radius:6px;text-decoration:none;font-weight:600;">
        What's New!
      </a>
    </div>

    <hr style="border:none;border-top:1px solid #eee;margin:18px 0"/>

    <div style="font-size:12px;color:#555;text-align:center;">
      The hidden Gem in Pattaya
    </div>
  </div>
  `;
}

function escapeHtml(s: string) {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}
