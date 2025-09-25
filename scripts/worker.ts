import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { sendEmail } from "../lib/email";
import { renderWhatsNew } from "../lib/render";

const db = new PrismaClient();
const RATE = parseInt(process.env.SEND_RATE_PER_MINUTE || "600", 10);

async function tick() {
  const toSend = await db.message.findMany({
    where: { status: "queued" },
    orderBy: { createdAt: "asc" },
    take: RATE,
  });

  for (const m of toSend) {
    try {
      const campaign = await db.campaign.findUnique({ where: { id: m.campaignId } });
      if (!campaign) continue;
      const contact = await db.contact.findUnique({ where: { id: m.contactId } });
      if (!contact || contact.status !== "subscribed") continue;

      const { html } = await renderWhatsNew({
        promotionalMessage: campaign.promotionalMessage,
        bannerTitle: campaign.bannerTitle,
        ctaUrl: process.env.APP_BASE_URL!,
        messageId: m.id,
        contactId: contact.id,
      });

      const r = await sendEmail({
        to: m.toEmail,
        subject: campaign.subject,
        html,
        fromName: campaign.fromName,
        fromEmail: campaign.fromEmail,
      });

      await db.message.update({
        where: { id: m.id },
        data: {
          status: "sent",
          providerId: r.id ?? null,
          lastEventAt: new Date(),
        },
      });
    } catch (err) {
      await db.message.update({
        where: { id: m.id },
        data: { status: "failed", lastEventAt: new Date() },
      });
    }
  }
}

async function main() {
  await tick();
  process.exit(0);
}

main();
