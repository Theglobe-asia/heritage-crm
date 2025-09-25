import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);

// Always build a safe "from" value
export const EMAIL_FROM =
  process.env.EMAIL_FROM_NAME && process.env.EMAIL_FROM_ADDRESS
    ? `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM_ADDRESS}>`
    : "The Globe <no-reply@updates.theglobeasia.com>"; // fallback
