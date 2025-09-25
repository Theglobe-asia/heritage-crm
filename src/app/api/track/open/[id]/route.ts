import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Track open
export async function GET(_: Request, { params, searchParams }: any) {
  const campaignId = params.id;
  const contactId = searchParams?.get("c");

  if (!campaignId || !contactId) {
    return new NextResponse("Missing params", { status: 400 });
  }

  try {
    await prisma.campaign.update({
      where: { id: campaignId },
      data: { opened: { increment: 1 } },
    });
  } catch (err) {
    console.error("Tracking open error", err);
  }

  // Transparent pixel
  const img = Buffer.from(
    "R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==",
    "base64"
  );
  return new NextResponse(img, {
    headers: {
      "Content-Type": "image/gif",
      "Content-Length": img.length.toString(),
    },
  });
}
