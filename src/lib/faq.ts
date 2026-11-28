import { brand } from "./site";

export type FaqPart = string | { label: string; href: string; download?: boolean };
export type FaqEntry = { question: string; answer: FaqPart[] };

export function getFaqEntries(catalogue?: string): FaqEntry[] {
  return [
    {
      question: "What types of LED lighting can I enquire about?",
      answer: [
        "Explore lighting applications for roads, outdoor sites, warehouses, commercial buildings and offices in our ",
        { label: "product catalogue", href: "/products" },
        ". Our team can confirm which fixtures suit your project.",
      ],
    },
    {
      question: "How can I request a quotation?",
      answer: [
        "Use our ",
        { label: "quote form", href: "/contact" },
        " and include the application, location and quantities you have in mind.",
      ],
    },
    {
      question: "Can I download the product catalogue?",
      answer: catalogue ? [
        "Yes. ",
        { label: "Download the product catalogue", href: catalogue, download: true },
        ".",
      ] : [
        "You can ",
        { label: "request a catalogue", href: "/contact?catalogue=1" },
        " from our team. There is currently no public download.",
      ],
    },
    {
      question: "How can I contact the Bharat Lums team?",
      answer: [
        "Call ",
        { label: brand.phone, href: brand.phoneHref },
        ", email ",
        { label: brand.email, href: `mailto:${brand.email}` },
        " or use the ",
        { label: "contact form", href: "/contact" },
        ".",
      ],
    },
    {
      question: "Where can I find technical specifications?",
      answer: [
        "Verified specifications appear on individual product pages when available. For a specific project, ",
        { label: "ask the team", href: "/contact" },
        " for model and technical details.",
      ],
    },
  ];
}
