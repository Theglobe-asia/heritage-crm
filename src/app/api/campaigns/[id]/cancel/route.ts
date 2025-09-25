import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Cancel scheduled campaign
export async function POST(_req: Request, context: any) {
  try {
    const { id } = context.params;
    await prisma.campaign.update({
      where: { id },
      data: { status: "Draft", scheduledAt: null },
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Cancel campaign error:", err);
    return NextResponse.json({ error: "Failed to cancel" }, { status: 500 });
  }
}
