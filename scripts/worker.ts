// scripts/worker.ts
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { sendEmail } from "@/lib/email";
import { renderWhatsNewEmail } from "@/lib/render";

const db = new PrismaClient();

async function main() {
  const campaigns = await db.campaign.findMany({
    where: { status: "Scheduled", scheduledAt: { lte: new Date() } },
  });

  for (const campaign of campaigns) {
    const contacts = await db.contact.findMany({
      where:
        campaign.audience === "ALL"
          ? {}
          : campaign.audience === "TEST"
          ? { email: process.env.TEST_EMAIL || "" }
          : { tag: campaign.audience as any },
    });

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
        console.error(`❌ Error sending to ${contact.email}`, err);
      }
    }

    await db.campaign.update({
      where: { id: campaign.id },
      data: { status: "Sent", sent: sentCount },
    });
  }

  console.log("Worker finished processing campaigns");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
