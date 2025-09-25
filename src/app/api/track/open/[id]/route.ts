import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const ONE_BY_ONE_GIF = Buffer.from(
  "R0lGODlhAQABAPAAAAAAAAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==",
  "base64"
);

export async function GET(_req: Request, context: any) {
  try {
    const { id } = context.params;
    if (id) {
      await prisma.campaign.update({
        where: { id },
        data: { opened: { increment: 1 } },
      });
    }
  } catch (err) {
    console.error("track open error:", err);
  }

  return new Response(ONE_BY_ONE_GIF, {
    headers: {
      "Content-Type": "image/gif",
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      "Content-Length": ONE_BY_ONE_GIF.length.toString(),
    },
  });
}
