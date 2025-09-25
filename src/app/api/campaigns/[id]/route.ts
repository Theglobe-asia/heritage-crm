import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// ✅ GET campaign by ID
export async function GET(req: Request, context: any) {
  try {
    const { id } = context.params;

    const campaign = await prisma.campaign.findUnique({
      where: { id },
    });

    if (!campaign) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    }

    return NextResponse.json(campaign);
  } catch (err) {
    console.error("GET campaign error:", err);
    return NextResponse.json({ error: "Failed to fetch campaign" }, { status: 500 });
  }
}

// ✅ UPDATE campaign
export async function PUT(req: Request, context: any) {
  try {
    const { id } = context.params;
    const body = await req.json();

    const updated = await prisma.campaign.update({
      where: { id },
      data: {
        title: body.title,
        message: body.message,
        audience: body.audience,
        sendOption: body.sendOption,
        scheduledAt: body.scheduledAt ? new Date(body.scheduledAt) : null,
        status: body.status,
      },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error("PUT campaign error:", err);
    return NextResponse.json({ error: "Failed to update campaign" }, { status: 500 });
  }
}

// ✅ DELETE campaign
export async function DELETE(req: Request, context: any) {
  try {
    const { id } = context.params;

    // delete reports first (relation cleanup)
    await prisma.report.deleteMany({ where: { campaignId: id } });

    await prisma.campaign.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE campaign error:", err);
    return NextResponse.json({ error: "Failed to delete campaign" }, { status: 500 });
  }
}
