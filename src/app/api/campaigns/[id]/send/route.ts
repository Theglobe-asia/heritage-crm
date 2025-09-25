import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request, context: any) {
  try {
    const { id } = context.params;

    const campaign = await prisma.campaign.findUnique({ where: { id } });
    if (!campaign) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    }

    // resolve audience
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

    const contacts = await prisma.contact.findMany({ where });

    let sentCount = 0;
    for (const contact of contacts) {
      try {
        await resend.emails.send({
          from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM_ADDRESS}>`,
          to: contact.email,
          subject: campaign.title,
          html: `
            <div style="font-family:sans-serif; line-height:1.5; color:#111">
              <h2 style="color:#f3c969; margin:0 0 8px">${campaign.title}</h2>
              <div style="margin:0 0 16px;">${campaign.message.replace(/\n/g, "<br/>")}</div>
              <a href="https://theglobeasia.com/whats-new/"
                 style="display:inline-block; padding:10px 18px; background:#f3c969; color:#000;
                        border-radius:6px; text-decoration:none; font-weight:bold;">
                What's New!
              </a>
            </div>
          `,
        });
        sentCount++;
      } catch (err) {
        console.error(`❌ Resend error for ${contact.email}`, err);
      }
    }

    await prisma.campaign.update({
      where: { id },
      data: { status: "Sent", sent: sentCount },
    });

    await prisma.report.upsert({
      where: { campaignId: id },
      create: { campaignId: id, sent: sentCount, opened: 0, clicked: 0 },
      update: { sent: sentCount },
    });

    return NextResponse.json({ success: true, sent: sentCount });
  } catch (err) {
    console.error("Send campaign error:", err);
    return NextResponse.json(
      { error: "Failed to send campaign" },
      { status: 500 }
    );
  }
}
