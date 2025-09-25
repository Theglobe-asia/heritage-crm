import { NextResponse } from "next/server";
import { Resend } from "resend";
import prisma from "@/lib/prisma";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const campaign = await prisma.campaign.findUnique({
      where: { id: params.id },
    });

    if (!campaign) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    }

    // Get contacts
    const contacts = await prisma.contact.findMany();
    if (contacts.length === 0) {
      return NextResponse.json({ error: "No contacts found" }, { status: 400 });
    }

    let sentCount = 0;

    for (const contact of contacts) {
      try {
        // Build email HTML
        const trackedHtml = `
          <div style="font-family:sans-serif;line-height:1.5;color:#111">
            <h2 style="color:#f3c969">${campaign.title}</h2>
            <p>${campaign.message}</p>
            ${
              campaign.mediaUrl
                ? `<img src="https://theglobeasia.com${campaign.mediaUrl}" width="400" style="border-radius:8px;margin:12px 0"/>`
                : ""
            }
            <a href="https://theglobeasia.com"
               style="display:inline-block;padding:10px 18px;background:#f3c969;color:#000;border-radius:6px;text-decoration:none;">
              What's New!
            </a>
            <img src="${process.env.APP_BASE_URL}/api/track/open?c=${campaign.id}&u=${contact.id}"
                 width="1" height="1" style="display:none"/>
          </div>
          <footer style="margin-top:20px;font-size:12px;color:#666;text-align:center;">
            The Globe in Pattaya - the hidden Gem where nights shine brighter.
          </footer>
        `;

        await resend.emails.send({
          from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM_ADDRESS}>`,
          to: contact.email,
          subject: campaign.title,
          html: trackedHtml,
        });

        sentCount++;
      } catch (err) {
        console.error(`❌ Failed to send to ${contact.email}:`, err);
      }
    }

    // ✅ Update campaign status
    await prisma.campaign.update({
      where: { id: campaign.id },
      data: { status: "Sent", sent: sentCount },
    });

    // ✅ Create or update report
    await prisma.report.upsert({
      where: { campaignId: campaign.id },
      update: {
        sentCount: sentCount,
      },
      create: {
        campaignId: campaign.id,
        sentCount: sentCount,
        opens: 0,
        clicks: 0,
      },
    });

    return NextResponse.json({ success: true, sent: sentCount });
  } catch (err) {
    console.error("Send error:", err);
    return NextResponse.json({ error: "Failed to send campaign" }, { status: 500 });
  }
}
