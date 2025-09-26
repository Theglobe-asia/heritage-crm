// src/app/api/campaigns/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// escape + line breaks (shared with scheduler + PUT)
function escapeHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function renderMessage(msg: string) {
  const safe = escapeHtml(msg).replace(/\r\n/g, "\n");
  return safe.replace(/\n/g, "<br/>");
}

// ✅ CREATE campaign
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, message, audience, sendOption, scheduledAt } = body;

    const campaign = await prisma.campaign.create({
      data: {
        title,
        message,
        audience,
        sendOption,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        status: sendOption === "Send Now" ? "Sent" : "Scheduled",
      },
    });

    // 🔒 Send immediately if "Send Now"
    if (sendOption === "Send Now") {
      const where =
        audience === "ALL"
          ? {}
          : audience === "TEST"
          ? { email: process.env.TEST_EMAIL || "" }
          : { tag: audience as any };

      const contacts = await prisma.contact.findMany({ where });

      const htmlBody = `
        <div style="font-family:sans-serif; line-height:1.5; color:#111">
          <h2 style="color:#f3c969; margin:0 0 8px">${escapeHtml(title)}</h2>
          <div style="margin:0 0 16px;">${renderMessage(message)}</div>
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

      let sentCount = 0;
      for (const contact of contacts) {
        try {
          await resend.emails.send({
            from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM_ADDRESS}>`,
            to: contact.email,
            subject: title,
            html: htmlBody,
          });
          sentCount++;
        } catch (err) {
          console.error(`❌ Resend error for ${contact.email}`, err);
        }
      }

          await prisma.report.upsert({
            where: { campaignId: campaign.id },
            create: { campaignId: campaign.id, sent: sentCount, opened: 0, clicked: 0 },
            update: { sent: sentCount },
          });

    }

    return NextResponse.json(campaign);
  } catch (err) {
    console.error("Campaign POST error:", err);
    return NextResponse.json(
      { error: "Failed to create campaign" },
      { status: 500 }
    );
  }
}

// ✅ LIST campaigns
export async function GET() {
  try {
    const campaigns = await prisma.campaign.findMany({
      orderBy: { createdAt: "desc" },
    });

    const safe = campaigns.map((c) => ({
      ...c,
      audience: String(c.audience),
      status: String(c.status),
    }));

    return NextResponse.json(safe);
  } catch (err) {
    console.error("Campaign GET error:", err);
    return NextResponse.json(
      { error: "Failed to load campaigns" },
      { status: 500 }
    );
  }
}
