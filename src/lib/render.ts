// src/lib/render.ts
import { PrismaClient } from "@prisma/client";
import { v4 as uuid } from "uuid";

const db = new PrismaClient();

/**
 * Render the "What's New" email template with tracking links.
 */
export async function renderWhatsNewEmail({
  campaignId,
  contactId,
  title,
  message,
}: {
  campaignId: string;
  contactId: string;
  title: string;
  message: string;
}) {
  // If you don’t have a "template" table, skip DB call
  // and just render inline HTML.
  const trackingId = uuid();

  return `
    <div style="font-family:sans-serif; line-height:1.5; color:#111">
      <h2 style="color:#f3c969; margin:0 0 8px">${title}</h2>
      <div style="margin:0 0 16px;">${message.replace(/\n/g, "<br/>")}</div>
      <a href="https://theglobeasia.com/whats-new/?tid=${trackingId}"
         style="display:inline-block; padding:10px 18px; background:#f3c969; color:#000;
                border-radius:6px; text-decoration:none; font-weight:bold;">
        What's New!
      </a>
      <footer style="margin-top:20px; font-size:12px; color:#666;">
        The Globe in Pattaya - the hidden Gem where nights shine brighter.
      </footer>
    </div>
  `;
}
