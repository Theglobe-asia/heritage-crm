import { Resend } from "resend"
import prisma from "@/lib/prisma"
import fs from "fs"
import path from "path"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendCampaign(campaignId: string) {
  return prisma.$transaction(async (tx) => {
    const found = await tx.campaign.findUnique({ where: { id: campaignId } })
    if (!found) throw new Error("Campaign not found")
    if (found.status === "Sent" || found.status === "Processing") {
      throw new Error("Campaign already processed")
    }

    await tx.campaign.update({
      where: { id: found.id },
      data: { status: "Processing" },
    })

    const contacts = await tx.contact.findMany()
    if (contacts.length === 0) {
      await tx.campaign.update({
        where: { id: found.id },
        data: { status: "Draft" },
      })
      return { sent: 0, skipped: true }
    }

    // Prepare inline attachment
    let attachments: { filename: string; content: Buffer; cid: string }[] = []
    let imgTag = ""

    if (found.mediaUrl && found.mediaUrl.startsWith("/uploads")) {
      const filePath = path.join(process.cwd(), "public", found.mediaUrl)
      if (fs.existsSync(filePath)) {
        const filename = path.basename(filePath)
        const fileContent = fs.readFileSync(filePath) // buffer
        attachments.push({
          filename,
          content: fileContent, // ✅ inline buffer
          cid: filename,        // ✅ match cid with <img>
        })
        imgTag = `<img src="cid:${filename}" width="400" style="border-radius:8px;margin:12px 0"/>`
      }
    }

    let sentCount = 0
    for (const contact of contacts) {
      try {
        const html = `
          <div style="font-family:sans-serif;line-height:1.5;color:#111">
            <h2 style="color:#f3c969">${found.title}</h2>
            <p>${found.message}</p>
            ${imgTag}
            <a href="https://theglobeasia.com"
               style="display:inline-block;padding:10px 18px;background:#f3c969;color:#000;border-radius:6px;text-decoration:none;">
              Visit The Globe
            </a>
            <img src="${process.env.APP_BASE_URL}/api/track/open?c=${found.id}&u=${contact.id}"
                 width="1" height="1" style="display:none"/>
          </div>
        `

        await resend.emails.send({
          from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM_ADDRESS}>`,
          to: contact.email,
          subject: found.title,
          html,
          attachments, // ✅ properly inline image
        })

        sentCount++
      } catch (err) {
        console.error(`❌ Failed to send to ${contact.email}:`, err)
      }
    }

    await tx.campaign.update({
      where: { id: found.id },
      data: { status: "Sent", sent: sentCount },
    })

    return { sent: sentCount, skipped: false }
  })
}
