import { NextResponse } from "next/server";
import { resend, EMAIL_FROM } from "@/lib/resend";

export async function GET() {
  try {
    const result = await resend.emails.send({
      from: EMAIL_FROM,
      to: "blackchef.alex@gmail.com", // test with Gmail/Outlook
      subject: "CRM Test Email",
      html: "<p>✅ Test email from CRM using Resend works!</p>",
    });

    return NextResponse.json({ success: true, result });
  } catch (error: any) {
    console.error("Resend error:", error);
    return NextResponse.json({ success: false, error });
  }
}
