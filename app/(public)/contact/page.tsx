import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { ContactForm } from "@/components/public/contact/ContactForm";
import { DirectContactCard } from "@/components/public/contact/DirectContactCard";
import { isKnownProjectSlug } from "@/lib/data/contact";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Whether you are buying, investing, partnering, or learning more about upcoming projects, our team is available to help.",
};

interface ContactPageProps {
  searchParams: Promise<{ project?: string }>;
}

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const { project } = await searchParams;
  const defaultProjectSlug = project && isKnownProjectSlug(project) ? project : "general";

  return (
    <>
      <section className="bg-cream-100 py-20">
        <Container className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-600">
            Contact Us
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-ink-950 sm:text-5xl">
            Speak with our team
          </h1>
          <p className="mt-4 text-base leading-relaxed text-stone-600">
            Whether you are buying, investing, partnering, or learning more about upcoming
            projects, our team is available to help.
          </p>
        </Container>
      </section>

      <section className="bg-cream-50 py-16">
        <Container className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          <ContactForm defaultProjectSlug={defaultProjectSlug} />
          <DirectContactCard />
        </Container>
      </section>
    </>
  );
}