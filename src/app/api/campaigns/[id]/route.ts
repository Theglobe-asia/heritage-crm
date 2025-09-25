import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET single campaign
export async function GET(
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
    return NextResponse.json(campaign);
  } catch (err) {
    console.error("Campaign GET error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// PUT update campaign
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const updated = await prisma.campaign.update({
      where: { id: params.id },
      data: body,
    });
    return NextResponse.json(updated);
  } catch (err) {
    console.error("Campaign PUT error:", err);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

// DELETE campaign
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.report.deleteMany({ where: { campaignId: params.id } });
    await prisma.campaign.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Campaign DELETE error:", err);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
