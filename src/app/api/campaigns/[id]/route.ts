import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/campaigns/[id]
export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const campaign = await prisma.campaign.findUnique({ where: { id } });
    if (!campaign) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(campaign);
  } catch (err) {
    console.error("Campaign GET error:", err);
    return NextResponse.json({ error: "Failed to fetch campaign" }, { status: 500 });
  }
}

// PUT /api/campaigns/[id]
export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await req.json();
    const campaign = await prisma.campaign.update({
      where: { id },
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

// DELETE /api/campaigns/[id]
export async function DELETE(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    await prisma.report.deleteMany({ where: { campaignId: id } });
    await prisma.campaign.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Campaign DELETE error:", err);
    return NextResponse.json({ error: "Failed to delete campaign" }, { status: 500 });
  }
}
