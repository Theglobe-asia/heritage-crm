import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

function escapeHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function renderMessage(msg: string) {
  const safe = escapeHtml(msg).replace(/\r\n/g, "\n");
  return safe.replace(/\n/g, "<br/>");
}

// POST /api/campaigns/[id]/send-test
export async function POST(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const campaign = await prisma.campaign.findUnique({ where: { id } });
    if (!campaign) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const testEmail = process.env.TEST_EMAIL;
    if (!testEmail) {
      return NextResponse.json({ error: "TEST_EMAIL not set" }, { status: 400 });
    }

    const htmlBody = `
      <div style="font-family:sans-serif; line-height:1.5; color:#111">
        <h2 style="color:#f3c969; margin:0 0 8px">${escapeHtml(campaign.title)}</h2>
        <div style="margin:0 0 16px;">${renderMessage(campaign.message)}</div>
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

    await resend.emails.send({
      from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM_ADDRESS}>`,
      to: testEmail,
      subject: `[TEST] ${campaign.title}`,
      html: htmlBody,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Campaign SEND-TEST error:", err);
    return NextResponse.json({ error: "Failed to send test email" }, { status: 500 });
  }
}
