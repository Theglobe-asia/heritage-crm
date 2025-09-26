// src/lib/render.ts
import { v4 as uuid } from "uuid";

// Escape HTML special characters
function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// Preserve line breaks in campaign messages
function renderMessage(msg: string) {
  const safe = escapeHtml(msg).replace(/\r\n/g, "\n");
  return safe.replace(/\n/g, "<br/>");
}

type RenderProps = {
  campaignId: string;
  contactId: string;
  title: string;
  message: string;
};

/**
 * ✅ Build a “What’s New” email with preserved formatting and tracking support.
 */
export function renderWhatsNewEmail({
  campaignId,
  contactId,
  title,
  message,
}: RenderProps): string {
  const trackingId = uuid();

  return `
    <div style="font-family:sans-serif; line-height:1.5; color:#111">
      <h2 style="color:#f3c969; margin:0 0 8px">${escapeHtml(title)}</h2>
      <div style="margin:0 0 16px;">${renderMessage(message)}</div>

      <a href="https://theglobeasia.com/whats-new/"
         style="display:inline-block; padding:10px 18px; background:#f3c969; color:#000;
                border-radius:6px; text-decoration:none; font-weight:bold;">
        What's New!
      </a>

      <img src="${process.env.APP_BASE_URL}/api/track/open/${trackingId}"
           alt=""
           style="display:none;width:1px;height:1px;" />

      <footer style="margin-top:20px; font-size:12px; color:#666;">
        The Globe in Pattaya - the hidden Gem where nights shine brighter.
      </footer>
    </div>
  `;
}
