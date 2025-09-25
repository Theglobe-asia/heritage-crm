// scripts/worker.ts
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { sendEmail } from "@/lib/email";
import { renderWhatsNewEmail } from "@/lib/render";

const db = new PrismaClient();

async function main() {
  try {
    // Pick due campaigns (Scheduled and time passed)
    const dueCampaigns = await db.campaign.findMany({
      where: {
        status: "Scheduled",
        scheduledAt: { lte: new Date() },
      },
    });

    for (const campaign of dueCampaigns) {
      console.log(`📩 Processing campaign: ${campaign.title}`);

      // Resolve audience
      const where =
        campaign.audience === "ALL"
          ? {}
          : campaign.audience === "TEST"
          ? { email: process.env.TEST_EMAIL || "" }
          : { tag: campaign.audience as any };

      const contacts = await db.contact.findMany({ where });

      let sentCount = 0;
      for (const contact of contacts) {
        try {
          const html = renderWhatsNewEmail({
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
          console.error(`❌ Failed to send email to ${contact.email}`, err);
        }
      }

      // Update campaign + report
      await db.$transaction([
        db.campaign.update({
          where: { id: campaign.id },
          data: { status: "Sent", sent: sentCount },
        }),
        db.report.upsert({
          where: { campaignId: campaign.id },
          create: {
            campaignId: campaign.id,
            sent: sentCount,
            opened: 0,
            clicked: 0,
          },
          update: { sent: sentCount },
        }),
      ]);

      console.log(
        `✅ Campaign "${campaign.title}" sent to ${sentCount} recipients.`
      );
    }
  } catch (err) {
    console.error("Worker error:", err);
  } finally {
    await db.$disconnect();
  }
}

main();
