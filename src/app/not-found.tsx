import { Action, PageIntro } from "@/components/ui";
export default function NotFound() {
  return (
    <section className="status-page">
      <PageIntro
        eyebrow="404"
        title="Page not found."
        description="That address does not point to a current Bharat Lums page."
      />
      <div className="shell section-tight">
        <Action href="/">Back to home</Action>
      </div>
    </section>
  );
}
