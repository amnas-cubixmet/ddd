import { ProjectsBrowser } from "@/components/browse";
import { PageIntro, QuoteBanner } from "@/components/ui";
import { metadata as pageMetadata } from "@/lib/site";

export const metadata = pageMetadata("Lighting Projects", "/portfolio");

export default function PortfolioPage() {
  return (
    <>
      <PageIntro
        eyebrow="Bharat Lums"
        title="Portfolio."
        description="For lighting options for your project, browse the product catalogue or contact our team."
      />
      <section className="shell section-tight" aria-label="Portfolio projects">
        <ProjectsBrowser />
      </section>
      <QuoteBanner />
    </>
  );
}
