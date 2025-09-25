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

    const testEmail = process.env.TEST_EMAIL;
    if (!testEmail) {
      return NextResponse.json(
        { error: "TEST_EMAIL env not set" },
        { status: 400 }
      );
    }

    await resend.emails.send({
      from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM_ADDRESS}>`,
      to: testEmail,
      subject: `[TEST] ${campaign.title}`,
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

    return NextResponse.json({ success: true, to: testEmail });
  } catch (err) {
    console.error("Send TEST campaign error:", err);
    return NextResponse.json(
      { error: "Failed to send test campaign" },
      { status: 500 }
    );
  }
}
