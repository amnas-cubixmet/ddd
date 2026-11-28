import { z } from "zod";

const optionalText = (max: number) => z.string().trim().max(max);

export const enquirySchema = z.object({
  name: z.string().trim().min(2, "Enter your full name.").max(100),
  company: optionalText(120),
  phone: z.string().trim().min(1, "Enter your phone number.").max(30).refine(
    (value) => /^(?=(?:\D*\d){7,15}\D*$)[+\d() -]+$/.test(value),
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
export function enquiryText(input: Enquiry) {
  return (
    [
      ["Name", input.name],
      ["Company", input.company],
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
