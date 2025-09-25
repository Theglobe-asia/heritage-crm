import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(_: Request, { params, searchParams }: any) {
  const campaignId = params.id;
  const contactId = searchParams?.get("c");

  if (!campaignId || !contactId) {
    return new NextResponse("Missing params", { status: 400 });
  }

  try {
    await prisma.campaign.update({
      where: { id: campaignId },
      data: { clicked: { increment: 1 } },
    });
  } catch (err) {
    console.error("Tracking click error", err);
  }

  // Redirect to landing page (update if needed)
  return NextResponse.redirect("https://theglobeasia.com");
}
