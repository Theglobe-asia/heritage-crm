// scripts/worker.ts
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { sendEmail } from "@/lib/email";
import { renderWhatsNewEmail } from "@/lib/render";

const db = new PrismaClient();

async function processScheduledCampaigns() {
  const now = new Date();

  // 1) Find a due campaign
  const campaign = await db.campaign.findFirst({
    where: { status: "Scheduled", scheduledAt: { lte: now } },
    orderBy: { createdAt: "asc" },
  });

  if (!campaign) return;

  // 2) Lock campaign for processing
  await db.campaign.update({
    where: { id: campaign.id },
    data: { status: "Processing" },
  });

  // 3) Resolve audience
  const audience = campaign.audience as
    | "TEST"
    | "ALL"
    | "BASIC"
    | "SILVER"
    | "VIP"
    | "GOLD";

  const where =
    audience === "ALL"
      ? {}
      : audience === "TEST"
      ? { email: process.env.TEST_EMAIL || "" }
      : { tag: audience as any };

  const contacts = await db.contact.findMany({ where });

  // 4) Send emails
  let sentCount = 0;
  for (const contact of contacts) {
    try {
      const html = renderWhatsNewEmail({
        campaignId: campaign.id,
        contactId: contact.id,
        title: campaign.title,
        message: campaign.message,
      });

      await sendEmail({
        to: contact.email,
        subject: campaign.title,
        html,
      });

      sentCount++;
    } catch (err) {
      console.error(`❌ Failed to send to ${contact.email}`, err);
    }
  }

  // 5) Mark as sent + sync report (using safe transaction form)
  await db.$transaction(async (tx) => {
    await tx.campaign.update({
      where: { id: campaign.id },
      data: { status: "Sent", sent: sentCount },
    });

    await tx.report.upsert({
      where: { campaignId: campaign.id }, // ✅ campaignId is unique in schema
      create: {
        campaignId: campaign.id,
        sent: sentCount,
        opened: 0,
        clicked: 0,
      },
      update: { sent: sentCount },
    });
  });

  console.log(
    `📩 Sent scheduled campaign "${campaign.title}" to ${sentCount} contacts.`
  );
}

processScheduledCampaigns()
  .catch((err) => {
    console.error("Worker error:", err);
  })
  .finally(async () => {
    await db.$disconnect();
  });
