// scripts/worker.ts
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { sendEmail } from "@/lib/email";
import { renderWhatsNewEmail } from "@/lib/render";

const db = new PrismaClient();

async function main() {
  const due = await db.campaign.findMany({
    where: { status: "Scheduled", scheduledAt: { lte: new Date() } },
    orderBy: { createdAt: "asc" },
  });

  for (const campaign of due) {
    // lock
    await db.campaign.update({
      where: { id: campaign.id },
      data: { status: "Processing" },
    });

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

    let sentCount = 0;
    const html = renderWhatsNewEmail({
      campaignId: campaign.id,
      title: campaign.title,
      message: campaign.message,
    });

    for (const contact of contacts) {
      try {
        await sendEmail({
          to: contact.email,
          subject: campaign.title,
          html,
        });
        sentCount++;
      } catch (err) {
        console.error(`❌ Error sending to ${contact.email}`, err);
      }
    }

    // ✅ Fix: `where` must use `id`, not `campaignId`
    await db.$transaction([
      db.campaign.update({
        where: { id: campaign.id },
        data: { status: "Sent", sent: sentCount },
      }),
      db.report.upsert({
        where: { id: campaign.id }, // <-- must match your Report @id field
        create: { id: campaign.id, campaignId: campaign.id, sent: sentCount, opened: 0, clicked: 0 },
        update: { sent: sentCount },
      }),
    ]);
  }

  console.log("✅ Worker finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
