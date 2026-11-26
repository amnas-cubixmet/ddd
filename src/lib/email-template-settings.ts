import { z } from "zod";
import type { EnquirySource } from "./enquiry";

const line = (max: number) => z.string().trim().min(1).max(max).refine(value => !/[\r\n\x00-\x1f\x7f]/.test(value));
const templateSchema = z.object({
  subject: line(100),
  heading: line(100),
  introduction: z.string().trim().min(1).max(300),
}).strict();
export const templateSettingsSchema = z.object({
  home: templateSchema,
  contact: templateSchema,
  quote: templateSchema,
}).strict();
export type TemplateSettings = z.infer<typeof templateSettingsSchema>;

export const defaultTemplates: TemplateSettings = {
  home: { subject: "New website enquiry", heading: "New website enquiry", introduction: "A visitor has submitted an enquiry from the Bharat Lums homepage." },
  contact: { subject: "New contact enquiry", heading: "New contact enquiry", introduction: "A customer has contacted the Bharat Lums team." },
  quote: { subject: "New quotation request", heading: "New quotation request", introduction: "A customer has requested a quotation for a lighting project." },
};
export const templateSources: EnquirySource[] = ["home", "contact", "quote"];
