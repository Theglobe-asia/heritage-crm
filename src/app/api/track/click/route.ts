import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const campaignId = searchParams.get("c");

  if (campaignId) {
    await prisma.campaign.update({
      where: { id: campaignId },
      data: { clicked: { increment: 1 } },
    });
  }

  // redirect to website
  return NextResponse.redirect("https://theglobeasia.com");
}
