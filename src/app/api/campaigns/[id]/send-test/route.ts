import { NextResponse } from "next/server"
import { Resend } from "resend"
import prisma from "@/lib/prisma"
import path from "path"
import fs from "fs"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const campaign = await prisma.campaign.findUnique({ where: { id: params.id } })
    if (!campaign) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 })
    }

    const testEmail = process.env.TEST_EMAIL
    if (!testEmail) {
      return NextResponse.json({ error: "Missing TEST_EMAIL in env" }, { status: 400 })
    }

    // === If campaign has media, try to embed it ===
    let attachments: { filename: string; content: Buffer; cid: string }[] = []
    let imageHtml = ""

    if (campaign.mediaUrl) {
      try {
        // Example: /uploads/filename.png
        const filePath = path.join(process.cwd(), "public", campaign.mediaUrl)
        const fileBuffer = fs.readFileSync(filePath)
        const fileName = path.basename(filePath)

        attachments.push({
          filename: fileName,
          content: fileBuffer,
          cid: "inlineImage", // referenced in HTML
        })

        imageHtml = `<img src="cid:inlineImage" width="400" style="border-radius:8px;margin:12px 0"/>`
      } catch (err) {
        console.error("⚠️ Failed to attach image:", err)
      }
    }

    const html = `
      <div style="font-family:sans-serif;line-height:1.5;color:#111;padding:20px;">
        <h2 style="color:#f3c969">${campaign.title}</h2>
        <p>${campaign.message}</p>
        ${imageHtml}
        <a href="https://theglobeasia.com"
           style="display:inline-block;padding:10px 18px;background:#f3c969;color:#000;border-radius:6px;text-decoration:none;">
          Visit The Globe
        </a>
      </div>
    `

    await resend.emails.send({
      from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM_ADDRESS}>`,
      to: testEmail,
      subject: `[TEST] ${campaign.title}`,
      html,
      attachments,
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("❌ Test send error:", err)
    return NextResponse.json({ error: "Failed to send test email" }, { status: 500 })
  }
}
