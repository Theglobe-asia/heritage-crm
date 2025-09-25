import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET campaign by ID
export async function GET(
  req: Request,
  context: { params: { id: string } }
) {
  try {
    const campaign = await prisma.campaign.findUnique({
      where: { id: context.params.id },
    });
    if (!campaign) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(campaign);
  } catch (err) {
    console.error("Campaign GET error:", err);
    return NextResponse.json({ error: "Failed to fetch campaign" }, { status: 500 });
  }
}

// UPDATE campaign
export async function PUT(
  req: Request,
  context: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const campaign = await prisma.campaign.update({
      where: { id: context.params.id },
      data: {
        title: body.title,
        message: body.message,
        audience: body.audience,
        sendOption: body.sendOption,
        scheduledAt: body.scheduledAt ? new Date(body.scheduledAt) : null,
      },
    });
    return NextResponse.json(campaign);
  } catch (err) {
    console.error("Campaign PUT error:", err);
    return NextResponse.json({ error: "Failed to update campaign" }, { status: 500 });
  }
}

// DELETE campaign
export async function DELETE(
  req: Request,
  context: { params: { id: string } }
) {
  try {
    await prisma.report.deleteMany({ where: { campaignId: context.params.id } });
    await prisma.campaign.delete({ where: { id: context.params.id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Campaign DELETE error:", err);
    return NextResponse.json({ error: "Failed to delete campaign" }, { status: 500 });
  }
}
