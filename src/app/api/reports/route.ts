import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const campaigns = await prisma.campaign.findMany({
      select: { id: true, title: true, sent: true, opened: true, clicked: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(campaigns);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
