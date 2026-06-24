import { Building2, ClipboardList, TrendingUp, Users } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

const features = [
  {
    icon: ClipboardList,
    title: "Structured Development Process",
    description:
      "From site selection to approvals, construction, and handover, every project follows a clear development process.",
  },
  {
    icon: Building2,
    title: "Premium Project Positioning",
    description:
      "Our developments are shaped around modern lifestyles, strong finishes, comfort, security, and usability.",
  },
  {
    icon: TrendingUp,
    title: "Market-Led Decisions",
    description:
      "We study location demand, buyer behaviour, rental potential, and future growth before shaping each project.",
  },
  {
    icon: Users,
    title: "Transparent Communication",
    description:
      "Buyers, investors, and partners get clear information throughout the project journey.",
  },
];

export function WhyChooseSection() {
  return (
    <section className="bg-ink-950 py-20">
      <Container>
        <SectionHeading
          align="center"
          tone="dark"
          eyebrow="Why Choose Jimo"
          title="Built for buyers, investors and partners"
          description="We combine market-led thinking, quality execution, and structured communication to create projects with credibility and long-term value."
        />

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, description }) => (
            <div key={title} className="rounded-2xl bg-white/5 p-6">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-red-600">
                <Icon className="h-5 w-5 text-white" />
              </span>
              <h3 className="mt-5 text-base font-bold text-white">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/60">{description}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}