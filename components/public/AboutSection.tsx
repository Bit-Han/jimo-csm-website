import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export function AboutSection() {
  return (
    <section className="bg-cream-100 py-20">
      <Container className="grid gap-10 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-600">
            About Jimo Development
          </p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-ink-950 sm:text-4xl">
            Driven by vision, built with purpose.
          </h2>
        </div>
        <div>
          <p className="text-base leading-relaxed text-stone-600">
            At Jimo Property Development Limited, every project is built on a foundation of
            integrity, precision, and long-term thinking. We do not just build structures; we
            create spaces that serve real people, support modern lifestyles, and generate lasting
            value for buyers, investors, and communities.
          </p>
          <ButtonLink
            href="/about"
            variant="ghost"
            size="sm"
            className="mt-4 px-0 text-red-600 hover:bg-transparent hover:text-red-700"
          >
            Learn more about us
            <ArrowRight className="h-4 w-4" />
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}