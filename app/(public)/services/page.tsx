// import { services } from "@/lib/data/mock-data";
// import { ContactFormSection } from "@/components/public/ContactForm";

// export const metadata = {
// 	title: "Our Services | Jimo Property Development",
// 	description:
// 		"Explore our comprehensive real estate services including property development, project management, and investment advisory.",
// };

// export default function ServicesPage() {
// 	return (
// 		<>
// 			{/* Hero Section */}
// 			<section className="min-h-[500px] bg-gradient-to-b from-blue-100 to-white flex items-center py-20 px-4 sm:px-6 lg:px-8">
// 				<div className="max-w-7xl mx-auto w-full">
// 					<div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
// 						<div>
// 							<h1 className="text-5xl md:text-6xl font-bold text-red-600 mb-6 leading-tight">
// 								Our Services
// 							</h1>
// 							<p className="text-lg text-gray-700 leading-relaxed">
// 								Lorem ipsum is simply dummy text of the printing and typesetting
// 								industry. Lorem ipsum has been the industry&apos;s standard
// 								dummy text ever since 1986, when designers at Letraset and James
// 								Mosley, the librarian at St Bride Printing Library
// 							</p>
// 						</div>

// 						<div className="bg-blue-200 h-96 rounded-lg flex items-center justify-center">
// 							<span className="text-gray-500">Service Image</span>
// 						</div>
// 					</div>
// 				</div>
// 			</section>

// 			{/* Services Grid */}
// 			<section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
// 				<div className="max-w-7xl mx-auto">
// 					<div className="space-y-16">
// 						{services.map((service, index) => (
// 							<div
// 								key={service.id}
// 								className={`grid grid-cols-1 md:grid-cols-2 gap-12 items-center ${
// 									index % 2 === 1 ? "md:grid-cols-2" : ""
// 								}`}
// 							>
// 								{index % 2 === 0 ? (
// 									<>
// 										<div>
// 											<h3 className="text-4xl font-bold text-gray-900 mb-6">
// 												{service.name}
// 											</h3>
// 											<p className="text-gray-700 text-lg leading-relaxed mb-4">
// 												{service.description}
// 											</p>
// 											<p className="text-gray-700 text-lg leading-relaxed">
// 												Lorem ipsum dolor sit amet, consectetur adipiscing elit,
// 												sed do eiusmod tempor incididunt ut labore et dolore
// 												magna aliqua.
// 											</p>
// 										</div>
// 										<div className="bg-gray-300 h-96 rounded-lg flex items-center justify-center">
// 											<span className="text-gray-500">Service Image</span>
// 										</div>
// 									</>
// 								) : (
// 									<>
// 										<div className="bg-gray-300 h-96 rounded-lg flex items-center justify-center">
// 											<span className="text-gray-500">Service Image</span>
// 										</div>
// 										<div>
// 											<h3 className="text-4xl font-bold text-gray-900 mb-6">
// 												{service.name}
// 											</h3>
// 											<p className="text-gray-700 text-lg leading-relaxed mb-4">
// 												{service.description}
// 											</p>
// 											<p className="text-gray-700 text-lg leading-relaxed">
// 												Lorem ipsum dolor sit amet, consectetur adipiscing elit,
// 												sed do eiusmod tempor incididunt ut labore et dolore
// 												magna aliqua.
// 											</p>
// 										</div>
// 									</>
// 								)}
// 							</div>
// 						))}
// 					</div>
// 				</div>
// 			</section>

// 			{/* Contact Section */}
// 			<ContactFormSection content={{
//                 heading: "",
//                 body: ""
//             }} form={null} />
// 		</>
// 	);
// }



// app/(public)/services/page.tsx
import type { Metadata } from "next";
import ServicesHero from "@/components/public/services/ServicesHero";
import ServiceCard from "@/components/public/services/ServiceCard";
import ServicesContact from "@/components/public/services/ServicesContact";

export const metadata: Metadata = {
  title: "Our Services",
  description:
    "Jimo Property Development offers property development, project management, investment advisory, and facility management services across Lagos.",
};

const SERVICES = [
  {
    id: "property-development",
    title: "Property Development",
    description:
      "We identify, acquire, and develop premium real estate in Lagos's most strategically positioned corridors. From land acquisition through to project completion, our full-cycle development process ensures every project meets the highest standards of quality, design, and long-term investment performance. We specialise in mid-rise residential developments, hospitality-integrated buildings, and investment-led real estate.",
    imageUrl:
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=900&q=80",
    imageAlt: "Property development — Jimo Construction",
    reverse: false,
  },
  {
    id: "project-management",
    title: "Project Management",
    description:
      "Our experienced project management team oversees every phase of development — from concept design and contractor procurement to construction supervision, quality control, and final delivery. We manage timelines, budgets, and stakeholder communication with precision, ensuring projects are delivered on schedule without compromising on quality.",
    imageUrl:
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=900&q=80",
    imageAlt: "Project management — construction site oversight",
    reverse: true,
  },
  {
    id: "investment-advisory",
    title: "Investment Advisory",
    description:
      "We help investors identify the right real estate opportunities in Lagos, providing clear data on rental yields, capital appreciation potential, market dynamics, and risk profiles. Whether you are a first-time investor, a diaspora buyer, or an institutional client, our advisory service ensures your real estate investment is structured for maximum long-term return.",
    imageUrl:
      "https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?w=900&q=80",
    imageAlt: "Investment advisory — real estate strategy",
    reverse: false,
  },
  {
    id: "facility-management",
    title: "Facility Management",
    description:
      "Beyond delivery, we offer professional facility management services to ensure completed developments are maintained to the standard they were built. Our facility management service covers property maintenance, security management, utilities oversight, common area upkeep, and tenant or resident support — protecting the long-term value of every Jimo-developed asset.",
    imageUrl:
      "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=900&q=80",
    imageAlt: "Facility management — premium property maintenance",
    reverse: false,
  },
];

export default function ServicesPage() {
  return (
    <div className="bg-[#f2f2f2] min-h-screen">
      <ServicesHero />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-5">
        {SERVICES.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>
      <ServicesContact />
    </div>
  );
}