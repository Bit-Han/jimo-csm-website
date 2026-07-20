//@components/public/CtaBanner

import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";

export interface CtaBannerCta {
  label: string;
  href: string;
}

export interface CtaBannerProps {
  eyebrow: string;
  title: string;
  description: string;
  primaryCta: CtaBannerCta;
  secondaryCta: CtaBannerCta;
}

export function CtaBanner({
  eyebrow,
  title,
  description,
  primaryCta,
  secondaryCta,
}: CtaBannerProps) {
  return (
    <section className="relative overflow-hidden bg-ink-950 py-20">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-maroon-950 via-ink-950 to-ink-950" />
      <Container className="relative max-w-3xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-400">{eyebrow}</p>
        <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">{title}</h2>
        <p className="mt-4 text-base leading-relaxed text-white/60">{description}</p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <ButtonLink href={primaryCta.href} variant="accent" size="lg">
            {primaryCta.label}
          </ButtonLink>
          <ButtonLink href={secondaryCta.href} variant="light" size="lg">
            {secondaryCta.label}
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}