import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // TODO: implement test send logic
    return NextResponse.json({ success: true, test: true, id: params.id });
  } catch (err) {
    console.error("Campaign SEND-TEST error:", err);
    return NextResponse.json({ error: "Failed to send test" }, { status: 500 });
  }
}
