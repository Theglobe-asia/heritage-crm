import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const campaign = await prisma.campaign.findUnique({ where: { id } });
    if (!campaign) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({
      ...campaign,
      audience: String(campaign.audience),
      status: String(campaign.status),
    });
  } catch (err) {
    console.error("Campaign GET error:", err);
    return NextResponse.json({ error: "Failed to load campaign" }, { status: 500 });
  }
}
