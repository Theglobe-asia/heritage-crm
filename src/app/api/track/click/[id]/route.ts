import prisma from "@/lib/prisma";

export async function GET(_req: Request, context: any) {
  const { id } = context.params;
  try {
    if (id) {
      await prisma.campaign.update({
        where: { id },
        data: { clicked: { increment: 1 } },
      });
    }
  } catch (err) {
    console.error("track click error:", err);
  }
  return Response.redirect("https://theglobeasia.com/whats-new/", 302);
}
