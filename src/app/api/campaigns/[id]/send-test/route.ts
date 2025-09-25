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

export async function POST(_req: Request, context: any) {
  try {
    const { id } = context.params;
    const c = await prisma.campaign.findUnique({ where: { id } });
    if (!c) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const to = process.env.TEST_EMAIL;
    if (!to) return NextResponse.json({ error: "TEST_EMAIL not set" }, { status: 400 });

    const html = `
      <div style="font-family:sans-serif; line-height:1.5; color:#111">
        <h2 style="color:#f3c969; margin:0 0 8px">${escapeHtml(c.title)}</h2>
        <div style="margin:0 0 16px;">${renderMessage(c.message)}</div>
        <a href="https://theglobeasia.com/whats-new/"
           style="display:inline-block; padding:10px 18px; background:#f3c969; color:#000;
                  border-radius:6px; text-decoration:none; font-weight:bold;">
          What's New!
        </a>
      </div>
    `;

    await resend.emails.send({
      from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM_ADDRESS}>`,
      to,
      subject: `[TEST] ${c.title}`,
      html,
    });

    return NextResponse.json({ success: true, to });
  } catch (err) {
    console.error("send-test error:", err);
    return NextResponse.json({ error: "Failed to send test" }, { status: 500 });
  }
}
