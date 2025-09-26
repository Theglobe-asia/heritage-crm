// scripts/worker.ts
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { sendEmail } from "@/lib/email";
import { renderWhatsNewEmail } from "@/lib/render";

const db = new PrismaClient();

async function run() {
  const now = new Date();

  // pick one due scheduled campaign and lock it
  const campaign = await db.$transaction(async (tx) => {
    const due = await tx.campaign.findFirst({
      where: { status: "Scheduled", scheduledAt: { lte: now } },
      orderBy: { createdAt: "asc" },
    });
    if (!due) return null;

    await tx.campaign.update({
      where: { id: due.id },
      data: { status: "Processing" },
    });

    return due;
  });

  if (!campaign) return;

  const audience = campaign.audience as "TEST" | "ALL" | "BASIC" | "SILVER" | "VIP" | "GOLD";
  const where =
    audience === "ALL"
      ? {}
      : audience === "TEST"
      ? { email: process.env.TEST_EMAIL || "" }
      : { tag: audience as any };

  const contacts = await db.contact.findMany({ where });

  const html = renderWhatsNewEmail({
    title: campaign.title,
    message: campaign.message,
  });

  let sentCount = 0;
  for (const contact of contacts) {
    try {
      await sendEmail({
        to: contact.email,
        subject: campaign.title,
        html,
      });
      sentCount++;
    } catch (e) {
      console.error(`Email error to ${contact.email}`, e);
    }
  }

  // mark sent + report (use two independent queries, not array form)
  await db.campaign.update({
    where: { id: campaign.id },
    data: { status: "Sent", sent: sentCount },
  });

  await db.report.upsert({
    where: { id: campaign.id }, // keep unique by id (or switch to campaignId if you have a unique on it)
    create: {
      id: campaign.id,
      campaignId: campaign.id,
      sent: sentCount,
      opened: 0,
      clicked: 0,
    },
    update: { sent: sentCount },
  });

  console.log(`Worker sent "${campaign.title}" to ${sentCount} contacts.`);
}

run()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
