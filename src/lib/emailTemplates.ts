import fs from "fs";
import path from "path";

export function buildCampaignEmail(campaign: any, contact: any) {
  let attachments: { filename: string; path: string; cid: string }[] = [];
  let imageHtml = "";

  if (campaign.mediaUrl && campaign.mediaUrl.startsWith("/uploads/")) {
    const filename = path.basename(campaign.mediaUrl);
    const filePath = path.join(process.cwd(), "public", campaign.mediaUrl);

    if (fs.existsSync(filePath)) {
      attachments.push({
        filename,
        path: filePath,
        cid: "campaign-image",
      });
      imageHtml = `<img src="cid:campaign-image" width="400" style="border-radius:8px;margin:12px 0"/>`;
    }
  }

  const html = `
    <div style="font-family:sans-serif;line-height:1.5;color:#111">
      <h2 style="color:#f3c969">${campaign.title}</h2>
      <p>${campaign.message}</p>
      ${imageHtml}
      <a href="https://theglobeasia.com"
         style="display:inline-block;padding:10px 18px;background:#f3c969;color:#000;
                border-radius:6px;text-decoration:none;">
        Visit The Globe
      </a>
      <img src="${process.env.APP_BASE_URL}/api/track/open?c=${campaign.id}&u=${contact.id}"
           width="1" height="1" style="display:none"/>
      <hr style="margin:20px 0;border:none;border-top:1px solid #eee"/>
      <p style="font-size:12px;color:#555;text-align:center;">
        The Globe in Pattaya – the hidden Gem where nights shine brighter.
      </p>
    </div>
  `;

  return { html, attachments };
}
