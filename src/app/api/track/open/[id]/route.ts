import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // TODO: log open event
    return NextResponse.json({ success: true, type: "open", id: params.id });
  } catch (err) {
    console.error("Track OPEN error:", err);
    return NextResponse.json({ error: "Failed to track open" }, { status: 500 });
  }
}
