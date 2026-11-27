import { brand } from "@/lib/site";
import EnquiryForm from "./enquiry-form";

export function DirectEnquiry({ defaults, home = false }: {
  defaults?: { interest?: string; message?: string };
  home?: boolean;
}) {
  return (
    <EnquiryForm
      home={home}
      whatsappNumber={brand.phoneHref.replace(/\D/g, "")}
      defaults={defaults}
    />
  );
}
