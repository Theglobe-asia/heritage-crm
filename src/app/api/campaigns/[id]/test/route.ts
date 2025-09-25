import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Resend } from "resend";
import fs from "fs";
import path from "path";

const resend = new Resend(process.env.RESEND_API_KEY);

// === Send Test Email ===
export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const campaign = await prisma.campaign.findUnique({
      where: { id: params.id },
    });

    if (!campaign) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    }

    const testEmail = process.env.TEST_EMAIL;
    if (!testEmail) {
      return NextResponse.json(
        { error: "Missing TEST_EMAIL in .env" },
        { status: 400 }
      );
    }

    // Prepare media attachment if exists
    let attachments: { filename: string; path: string }[] = [];
    let imageTag = "";

    if (campaign.mediaUrl) {
      const filePath = path.join(process.cwd(), "public", campaign.mediaUrl);
      if (fs.existsSync(filePath)) {
        const fileName = path.basename(filePath);
        attachments.push({ filename: fileName, path: filePath });
        imageTag = `<img src="cid:${fileName}" width="400" style="border-radius:8px;margin:12px 0"/>`;
      }
    }

    const html = `
      <div style="font-family:sans-serif;line-height:1.5;color:#111">
        <h2 style="color:#f3c969">${campaign.title}</h2>
        <p>${campaign.message}</p>
        ${imageTag}
        <a href="https://theglobeasia.com"
           style="display:inline-block;padding:10px 18px;background:#f3c969;color:#000;border-radius:6px;text-decoration:none;">
          What's New!
        </a>
        <p style="margin-top:20px;font-size:12px;color:#666;text-align:center;">
          The Globe in Pattaya - the hidden Gem where nights shine brighter.
        </p>
      </div>
    `;

    await resend.emails.send({
      from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM_ADDRESS}>`,
      to: testEmail,
      subject: `[TEST] ${campaign.title}`,
      html,
      attachments,
    });

    return NextResponse.json({ success: true, message: "Test email sent" });
  } catch (err) {
    console.error("Test email error:", err);
    return NextResponse.json(
      { error: "Failed to send test email" },
      { status: 500 }
    );
  }
}
