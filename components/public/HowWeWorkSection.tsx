import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

const steps = [
  { number: "01", title: "Site Selection & Due Diligence" },
  { number: "02", title: "Feasibility & Concept Development" },
  { number: "03", title: "Design & Planning" },
  { number: "04", title: "Approvals & Structuring" },
  { number: "05", title: "Construction & Quality Control" },
  { number: "06", title: "Sales, Handover & Management" },
];

export function HowWeWorkSection() {
  return (
    <section className="bg-cream-50 py-20">
      <Container>
        <SectionHeading
          align="center"
          eyebrow="How We Work"
          title="A clear development approach"
          description="Every project moves through a disciplined process from site selection to delivery."
        />

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((step) => (
            <div key={step.number} className="rounded-2xl border border-stone-200 bg-white p-6">
              <p className="text-sm font-bold text-red-600">{step.number}</p>
              <p className="mt-2 text-base font-semibold text-ink-950">{step.title}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}