// src/lib/scheduler.ts
import cron from "node-cron";
import prisma from "@/lib/prisma";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// escape text → safe HTML
function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
// preserve user line breaks from textarea
function renderMessage(msg: string) {
  const safe = escapeHtml(msg).replace(/\r\n/g, "\n");
  return safe.replace(/\n/g, "<br/>");
}

const g = globalThis as any;
if (!g.__scheduler_started) {
  g.__scheduler_started = true;

  cron.schedule("* * * * *", async () => {
    try {
      const now = new Date();

      // 1) Pick ONE due campaign and lock it
      const picked = await prisma.$transaction(async (tx) => {
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

      if (!picked) return;

      // 2) Resolve audience
      const audience = picked.audience as "TEST" | "ALL" | "BASIC" | "SILVER" | "VIP" | "GOLD";
      const where =
        audience === "ALL"
          ? {}
          : audience === "TEST"
          ? { email: process.env.TEST_EMAIL || "" }
          : { tag: audience as any };

      const contacts = await prisma.contact.findMany({ where });

      // 3) Build common HTML (line breaks preserved)
      const htmlBody = `
        <div style="font-family:sans-serif; line-height:1.5; color:#111">
          <h2 style="color:#f3c969; margin:0 0 8px">${escapeHtml(picked.title)}</h2>
          <div style="margin:0 0 16px;">${renderMessage(picked.message)}</div>
          <a href="https://theglobeasia.com/whats-new/"
             style="display:inline-block; padding:10px 18px; background:#f3c969; color:#000;
                    border-radius:6px; text-decoration:none; font-weight:bold;">
            What's New!
          </a>
          <footer style="margin-top:20px; font-size:12px; color:#666;">
            The Globe in Pattaya - the hidden Gem where nights shine brighter.
          </footer>
        </div>
      `;

      // 4) Send
      let sentCount = 0;
      for (const contact of contacts) {
        try {
          await resend.emails.send({
            from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM_ADDRESS}>`,
            to: contact.email,
            subject: picked.title,
            html: htmlBody,
          });
          sentCount++;
        } catch (err) {
          console.error(`❌ Resend error for ${contact.email}`, err);
        }
      }

      // 5) Mark sent + sync report
      await prisma.$transaction([
        prisma.campaign.update({
          where: { id: picked.id },
          data: { status: "Sent", sent: sentCount },
        }),
        prisma.report.upsert({
          where: { campaignId: picked.id },
          create: { campaignId: picked.id, sent: sentCount, opened: 0, clicked: 0 },
          update: { sent: sentCount },
        }),
      ]);

      console.log(`📩 Sent scheduled campaign "${picked.title}" to ${sentCount} contacts.`);
    } catch (err) {
      console.error("⏰ Scheduler error:", err);
    }
  });
}
