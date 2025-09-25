import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const campaignId = searchParams.get("c");

  if (campaignId) {
    await prisma.campaign.update({
      where: { id: campaignId },
      data: { opened: { increment: 1 } },
    });
  }

  // return 1x1 pixel transparent
  const img = Buffer.from(
    "R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==",
    "base64"
  );
  return new NextResponse(img, {
    headers: { "Content-Type": "image/gif" },
  });
}
