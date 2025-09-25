import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

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

    if (campaign.status !== "Scheduled") {
      return NextResponse.json(
        { error: "Only scheduled campaigns can be cancelled" },
        { status: 400 }
      );
    }

    await prisma.campaign.update({
      where: { id: params.id },
      data: { status: "Draft" },
    });

    return NextResponse.json({ success: true, message: "Campaign cancelled" });
  } catch (err) {
    console.error("Cancel error:", err);
    return NextResponse.json({ error: "Failed to cancel campaign" }, { status: 500 });
  }
}
