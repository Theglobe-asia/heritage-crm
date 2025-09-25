// src/lib/mailer.ts
import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendBulkEmail({
  fromName,
  fromAddress,
  subject,
  html,
  recipients,
}: {
  fromName: string;
  fromAddress: string;
  subject: string;
  html: string;
  recipients: string[];
}) {
  // Resend best practice: single call per recipient for tracking
  for (const to of recipients) {
    await resend.emails.send({
      from: `${fromName} <${fromAddress}>`,
      to,
      subject,
      html,
    });
  }
}

export function campaignHtml({ title, message }: { title: string; message: string }) {
  // Footer + What's New button per your map
  return `
  <div style="font-family:Inter,Arial,sans-serif;line-height:1.6;color:#111">
    <h2 style="margin:0 0 10px;color:#f3c969">${escapeHtml(title)}</h2>
    <div style="white-space:pre-wrap">${escapeHtml(message)}</div>

    <div style="margin:16px 0">
      <a href="https://theglobeasia.com" 
         style="display:inline-block;padding:10px 16px;background:#f3c969;color:#000;border-radius:8px;text-decoration:none;font-weight:600">
        What's New!
      </a>
    </div>

    <hr style="border:none;border-top:1px solid #eee;margin:20px 0"/>

    <p style="margin:0;color:#666;font-size:12px">
      <em>The hidden Gem in Pattaya</em>
    </p>
  </div>
  `;
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
