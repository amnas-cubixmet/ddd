import "server-only";
import nodemailer from "nodemailer";
import { z } from "zod";
import { type Enquiry, type EnquirySource } from "./enquiry";
import { buildEnquiryEmail } from "./email-template";
import { defaultTemplates } from "./email-template-settings";

const configSchema = z.object({
  senderName: z.string().trim().min(1).max(100).refine(v => !/[\r\n\x00-\x1f\x7f]/.test(v)),
  senderEmail: z.string().trim().max(160).email(),
  recipientEmail: z.string().trim().max(160).email(),
  appPassword: z.string().regex(/^[A-Za-z0-9]{16}$/),
  host: z.literal("smtp.gmail.com"),
  port: z.union([z.literal(465), z.literal(587)]),
  secure: z.boolean(),
}).refine(v => v.secure === (v.port === 465));

function getConfig() {
  const port = Number(process.env.SMTP_PORT || "465");
  const secure = process.env.SMTP_SECURE ?? String(port === 465);
  return configSchema.safeParse({
    senderName: process.env.SMTP_FROM_NAME || "BHARAT LUMS",
    senderEmail: process.env.SMTP_USER || "",
    recipientEmail: process.env.CONTACT_RECEIVER_EMAIL || "",
    appPassword: (process.env.SMTP_APP_PASSWORD || "").replace(/\s/g, ""),
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port,
    secure: secure === "true" ? true : secure === "false" ? false : undefined,
  });
}
export function deliveryEnabled() { return getConfig().success; }

// Best-effort protection within a single running server process.
const windowMs = 600_000;
const buckets = new Map<string, { count: number; expires: number }>();
let globalBucket = { count: 0, expires: 0 };
export function allowEnquiry(address: string) {
  const now = Date.now();
  if (globalBucket.expires <= now) globalBucket = { count: 0, expires: now + windowMs };
  if (globalBucket.count >= 60) return false;
  for (const [key, entry] of buckets) if (entry.expires <= now) buckets.delete(key);
  const key = address.slice(0, 256);
  const bucket = buckets.get(key) ?? { count: 0, expires: now + windowMs };
  if (bucket.count >= 6) return false;
  bucket.count += 1;
  buckets.set(key, bucket);
  globalBucket.count += 1;
  return true;
}
const submissions = new Map<string, { state: "pending" | "sent"; expires: number }>();
export async function deliverEnquiry(input: Enquiry, requestId: string, source: EnquirySource = "contact") {
  const config = getConfig();
  if (!config.success) throw new Error("SMTP not configured");
  const now = Date.now();
  for (const [key, entry] of submissions) if (entry.expires <= now) submissions.delete(key);
  const existing = submissions.get(requestId);
  if (existing) return existing.state === "sent";
  if (submissions.size >= 10000) return false;
  const settings = config.data;
  const mailer = nodemailer.createTransport({
    host: settings.host, port: settings.port, secure: settings.secure,
    requireTLS: !settings.secure,
    auth: { user: settings.senderEmail, pass: settings.appPassword },
    tls: { minVersion: "TLSv1.2", rejectUnauthorized: true },
    connectionTimeout: 8000, greetingTimeout: 8000, socketTimeout: 15000,
    disableFileAccess: true, disableUrlAccess: true,
  });
  submissions.set(requestId, { state: "pending", expires: now + windowMs });
  let accepted = false;
  try {
    const result = await mailer.sendMail({
      from: { name: settings.senderName, address: settings.senderEmail },
      to: settings.recipientEmail, replyTo: input.email,
      ...buildEnquiryEmail(input, source, defaultTemplates, requestId),
    });
    accepted = result.accepted.length > 0 && result.rejected.length === 0;
    if (accepted) submissions.set(requestId, { state: "sent", expires: Date.now() + 86_400_000 });
    return accepted;
  } finally {
    if (!accepted) submissions.delete(requestId);
    mailer.close();
  }
}