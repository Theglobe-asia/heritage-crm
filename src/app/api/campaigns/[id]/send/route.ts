import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // TODO: implement real send logic
    return NextResponse.json({ success: true, id: params.id });
  } catch (err) {
    console.error("Campaign SEND error:", err);
    return NextResponse.json({ error: "Failed to send" }, { status: 500 });
  }
}
