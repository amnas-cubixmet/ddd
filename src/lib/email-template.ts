import { enquirySources, type Enquiry, type EnquirySource } from "./enquiry";
import type { TemplateSettings } from "./email-template-settings";

function escape(value: string) {
  return value.replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] ?? c));
}
function multiline(value: string) { return escape(value).replace(/\r?\n/g, "<br>"); }
function cleanHeader(value: string) { return value.replace(/[\r\n\x00-\x1f\x7f]/g, " ").trim(); }

export function buildEnquiryEmail(input: Enquiry, source: EnquirySource, templates: TemplateSettings, requestId: string, test = false) {
  const template = templates[source];
  const origin = enquirySources[source];
  const rows = [
    ["Full name", input.name], ["Email address", input.email], ["Phone number", input.phone],
    ["Company name", input.company], ["Subject", input.subject], ["Product interest", input.interest],
    ["Project type", input.projectType], ["Project location", input.location], ["Estimated quantity", input.quantity],
  ].filter((row): row is [string, string] => Boolean(row[1]));
  const heading = (test ? "TEST — " : "") + template.heading;
  const subject = cleanHeader(`${test ? "[TEST] " : ""}BHARAT LUMS | ${template.subject}${input.subject ? " — " + input.subject : ""}`).slice(0, 240);
  const text = [heading, template.introduction, `Source: ${origin.label} (${origin.path})`, `Reference: ${requestId}`, ...rows.map(([label, value]) => `${label}: ${value}`), "", "Message:", input.message, "", test ? "Sample only. No customer submitted this test." : "Reply to this email to contact the customer."].join("\n");
  const html = `<!doctype html><html lang="en"><body style="margin:0;padding:0;background:#f0f1f3;font-family:Arial,sans-serif;color:#171717"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f0f1f3"><tr><td align="center" style="padding:24px 12px"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:620px;background:#ffffff;border:1px solid #dddddd;border-radius:12px;overflow:hidden"><tr><td style="background:#090909;color:#ffffff;padding:28px 24px"><div style="font-size:23px;font-weight:bold;letter-spacing:2px">BHARAT LUMS</div><div style="font-size:11px;color:#dddddd;letter-spacing:1px;margin-top:8px">POWERING A BRIGHTER TOMORROW</div></td></tr><tr><td style="padding:24px"><div style="font-size:12px;font-weight:bold;color:#315b93">${escape(origin.label.toUpperCase())}</div><h1 style="font-size:24px;line-height:1.3;margin:12px 0">${escape(heading)}</h1><p style="font-size:15px;line-height:1.6;color:#444">${multiline(template.introduction)}</p><p style="font-size:12px;color:#666;overflow-wrap:anywhere">Reference: ${escape(requestId)}</p><table width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;table-layout:fixed;font-size:14px">${rows.map(([label,value]) => `<tr><th scope="row" align="left" valign="top" style="width:38%;padding:12px 8px;border-bottom:1px solid #ddd;color:#555;font-weight:normal">${escape(label)}</th><td style="padding:12px 8px;border-bottom:1px solid #ddd;overflow-wrap:anywhere;word-break:break-word">${multiline(value)}</td></tr>`).join("")}</table><h2 style="font-size:17px;margin:24px 0 12px">Message</h2><div style="background:#f5f5f5;border:1px solid #e5e5e5;padding:16px;line-height:1.65;overflow-wrap:anywhere;word-break:break-word">${multiline(input.message)}</div><p style="font-size:13px;color:#555;line-height:1.6;margin:20px 0 0">${test ? "Sample only. No customer submitted this test." : "Reply directly to this email to contact the customer."}</p></td></tr><tr><td style="background:#090909;color:#dddddd;text-align:center;padding:18px;font-size:12px">BHARAT LUMS · Website enquiry system</td></tr></table></td></tr></table></body></html>`;
  return { subject, text, html };
}

export const sampleEnquiry: Enquiry = {
  name: "Sample Customer", company: "Example Company", email: "customer@example.com", phone: "+91 98765 43210",
  subject: "Lighting project", interest: "LED lighting", projectType: "Commercial", location: "Sample location", quantity: "20",
  message: "This is a sample enquiry for checking your email template and SMTP settings.",
};
