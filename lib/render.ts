import { PrismaClient } from "@prisma/client";
import { v4 as uuid } from "uuid";

const db = new PrismaClient();

export async function renderWhatsNew({
  promotionalMessage,
  bannerTitle,
  ctaUrl,
  messageId,
  contactId,
}: {
  promotionalMessage: string;
  bannerTitle: string;
  ctaUrl: string;
  messageId: string;
  contactId: string;
}) {
  const tpl = await db.template.findUnique({ where: { name: "whats-new" } });
  if (!tpl) throw new Error("Template not found");

  const trackingId = uuid();
  const base = process.env.APP_BASE_URL!;
  const openPixel = `${base}/api/track/open?t=${trackingId}`;
  const unsubscribeUrl = `${base}/u/${contactId}`;

  const html = tpl.html
    .replace("{{subject}}", "What’s New?")
    .replace("{{banner}}", bannerTitle)
    .replace("{{message}}", promotionalMessage)
    .replace("{{ctaUrl}}", ctaUrl)
    .replace("{{openPixel}}", openPixel)
    .replace("{{unsubscribeUrl}}", unsubscribeUrl);

  return { html, trackingId };
}
