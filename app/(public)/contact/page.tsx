
// // app/(public)/services/page.tsx
// import type { Metadata } from "next";
// import ServicesHero from "@/components/public/services/ServicesHero";
// import ServiceCard from "@/components/public/services/ServiceCard";
// import ServicesContact from "@/components/public/services/ServicesContact";

// export const metadata: Metadata = {
//   title: "Our Services",
//   description:
//     "Jimo Property Development offers property development, project management, investment advisory, and facility management services across Lagos.",
// };

// const SERVICES = [
//   {
//     id: "property-development",
//     title: "Property Development",
//     description:
//       "We identify, acquire, and develop premium real estate in Lagos's most strategically positioned corridors. From land acquisition through to project completion, our full-cycle development process ensures every project meets the highest standards of quality, design, and long-term investment performance. We specialise in mid-rise residential developments, hospitality-integrated buildings, and investment-led real estate.",
//     imageUrl:
//       "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=900&q=80",
//     imageAlt: "Property development — Jimo Construction",
//     reverse: false,
//   },
//   {
//     id: "project-management",
//     title: "Project Management",
//     description:
//       "Our experienced project management team oversees every phase of development — from concept design and contractor procurement to construction supervision, quality control, and final delivery. We manage timelines, budgets, and stakeholder communication with precision, ensuring projects are delivered on schedule without compromising on quality.",
//     imageUrl:
//       "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=900&q=80",
//     imageAlt: "Project management — construction site oversight",
//     reverse: true,
//   },
//   {
//     id: "investment-advisory",
//     title: "Investment Advisory",
//     description:
//       "We help investors identify the right real estate opportunities in Lagos, providing clear data on rental yields, capital appreciation potential, market dynamics, and risk profiles. Whether you are a first-time investor, a diaspora buyer, or an institutional client, our advisory service ensures your real estate investment is structured for maximum long-term return.",
//     imageUrl:
//       "https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?w=900&q=80",
//     imageAlt: "Investment advisory — real estate strategy",
//     reverse: false,
//   },
//   {
//     id: "facility-management",
//     title: "Facility Management",
//     description:
//       "Beyond delivery, we offer professional facility management services to ensure completed developments are maintained to the standard they were built. Our facility management service covers property maintenance, security management, utilities oversight, common area upkeep, and tenant or resident support — protecting the long-term value of every Jimo-developed asset.",
//     imageUrl:
//       "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=900&q=80",
//     imageAlt: "Facility management — premium property maintenance",
//     reverse: false,
//   },
// ];

// export default function ServicesPage() {
//   return (
//     <div className="bg-[#f2f2f2] min-h-screen">
//       <ServicesHero />
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-5">
//         {SERVICES.map((service) => (
//           <ServiceCard key={service.id} service={service} />
//         ))}
//       </div>
//       <ServicesContact />
//     </div>
//   );
// }


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