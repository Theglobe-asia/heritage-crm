import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // TODO: log click event
    return NextResponse.json({ success: true, type: "click", id: params.id });
  } catch (err) {
    console.error("Track CLICK error:", err);
    return NextResponse.json({ error: "Failed to track click" }, { status: 500 });
  }
}
