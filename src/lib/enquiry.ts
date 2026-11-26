import { z } from "zod";

const optionalText = (max: number) => z.string().trim().max(max);

export const enquirySchema = z.object({
  name: z.string().trim().min(2, "Enter your full name.").max(100),
  company: optionalText(120),
  email: z
    .string()
    .trim()
    .min(1, "Enter your email.")
    .max(160)
    .email("Enter a valid email address."),
  phone: optionalText(30).refine(
    (value) => !value || /^(?=(?:\D*\d){7,15}\D*$)[+\d() -]+$/.test(value),
    "Enter a valid phone number.",
  ),
  subject: optionalText(150).optional(),
  interest: optionalText(150),
  projectType: optionalText(80),
  location: optionalText(160),
  quantity: optionalText(8).refine(
    (value) => !value || /^[1-9]\d{0,6}$/.test(value),
    "Enter a positive whole number.",
  ),
  message: z
    .string()
    .trim()
    .min(12, "Add at least 12 characters about your project.")
    .max(2200),
  website: z.string().max(100).optional(),
});

export type Enquiry = z.infer<typeof enquirySchema>;
export const enquirySourceSchema = z.enum(["home", "contact", "quote"]);
export type EnquirySource = z.infer<typeof enquirySourceSchema>;

export const enquirySources = {
  home: { label: "Homepage", title: "New website enquiry", path: "/" },
  contact: { label: "Contact page", title: "New contact enquiry", path: "/contact" },
  quote: { label: "Request a quote", title: "New quotation request", path: "/request-quote" },
} satisfies Record<EnquirySource, { label: string; title: string; path: string }>;

export function enquiryEmailHref(email: string, draft?: string) {
  const subject = encodeURIComponent("Bharat Lums website enquiry");
  const body = draft
    ? `&body=${encodeURIComponent(draft.replace(/\r?\n/g, "\r\n"))}`
    : "";
  return `mailto:${email}?subject=${subject}${body}`;
}

export function enquiryText(input: Enquiry) {
  return (
    [
      ["Name", input.name],
      ["Company", input.company],
      ["Email", input.email],
      ["Phone", input.phone],
      ["Subject", input.subject],
      ["Product interest", input.interest],
      ["Project type", input.projectType],
      ["Location", input.location],
      ["Quantity", input.quantity],
    ]
      .filter(([, value]) => value)
      .map(([label, value]) => `${label}: ${value}`)
      .join("\n") + `\n\n${input.message}`
  );
}
