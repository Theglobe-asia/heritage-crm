// lib/render.ts
import { v4 as uuid } from "uuid";

export async function renderWhatsNewEmail({
  campaign,
  contactId,
}: {
  campaign: { title: string; message: string };
  contactId: string;
}) {
  const trackingId = uuid();

  // Escape & preserve line breaks
  const escapeHtml = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const renderMessage = (msg: string) =>
    escapeHtml(msg).replace(/\r\n/g, "\n").replace(/\n/g, "<br/>");

  return `
    <div style="font-family:sans-serif; line-height:1.5; color:#111">
      <h2 style="color:#f3c969; margin:0 0 8px">${escapeHtml(campaign.title)}</h2>
      <div style="margin:0 0 16px;">${renderMessage(campaign.message)}</div>
      <a href="https://theglobeasia.com/whats-new/"
         style="display:inline-block; padding:10px 18px; background:#f3c969; color:#000;
                border-radius:6px; text-decoration:none; font-weight:bold;">
        What's New!
      </a>
      <footer style="margin-top:20px; font-size:12px; color:#666;">
        The Globe in Pattaya - the hidden Gem where nights shine brighter.
      </footer>
      <img src="https://your-domain.com/api/track/open/${trackingId}" width="1" height="1" />
    </div>
  `;
}
