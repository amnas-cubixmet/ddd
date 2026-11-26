import { z } from "zod";
import { enquirySchema, enquirySourceSchema } from "@/lib/enquiry";
import { allowEnquiry, deliverEnquiry, deliveryEnabled } from "@/lib/delivery";

export const runtime = "nodejs";
const payloadSchema = enquirySchema.extend({ requestId: z.uuid(), home: z.boolean().optional(), source: enquirySourceSchema.optional() });
const maxBytes = 16_384;

function failure(status: number, message: string) {
  return Response.json({ ok: false, message }, { status });
}

export async function POST(request: Request) {
  if (request.headers.get("sec-fetch-site") === "cross-site")
    return failure(403, "Open the enquiry form on the Bharat Lums website.");
  if (
    !request.headers
      .get("content-type")
      ?.toLowerCase()
      .startsWith("application/json")
  )
    return failure(415, "Use JSON for this request.");
  if (!request.body || Number(request.headers.get("content-length")) > maxBytes)
    return failure(413, "The request is too large.");
  const reader = request.body.getReader();
  const decoder = new TextDecoder("utf-8", { fatal: true });
  let text = "";
  let size = 0;
  let data: unknown;
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > maxBytes) {
        await reader.cancel();
        return failure(413, "The request is too large.");
      }
      text += decoder.decode(value, { stream: true });
    }
    data = JSON.parse(text + decoder.decode());
  } catch {
    return failure(400, "The request could not be read.");
  } finally {
    reader.releaseLock();
  }
  const parsed = payloadSchema.safeParse(data);
  if (!parsed.success || parsed.data.website || ((parsed.data.home || parsed.data.source === "home") && (!parsed.data.phone || !parsed.data.subject || parsed.data.subject.length < 2)))
    return failure(
      400,
      "The enquiry could not be validated. Check the form and try again.",
    );
  if (!deliveryEnabled())
    return failure(
      503,
      "Online submission is unavailable. Send your enquiry by email.",
    );
  const address =
    request.headers.get("x-vercel-forwarded-for") ??
    request.headers.get("x-real-ip") ??
    "local";
  try {
    if (!(await allowEnquiry(address)))
      return failure(429, "Too many enquiries. Try again in a few minutes.");
    const { requestId, source, home, ...input } = parsed.data;
    if (!(await deliverEnquiry(input, requestId, source ?? (home ? "home" : "contact"))))
      return failure(
        502,
        "Email service did not accept your enquiry. Try again or use the email option.",
      );
  } catch {
    return failure(
      502,
      "Online submission is temporarily unavailable. Try again or use the email option.",
    );
  }
  return Response.json({
    ok: true,
    message:
      "Your enquiry was accepted by our email service. We’ll be in touch.",
  });
}
