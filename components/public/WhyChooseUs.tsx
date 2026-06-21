// // components/public/home/why-choose-us-section.tsx
// import { ICON_MAP } from "@/lib/utils/icon-map";
// import type { WhyChooseUsContent } from "@/lib/types/public-content";

// export function WhyChooseUsSection({
// 	content,
// }: {
// 	content: WhyChooseUsContent;
// }) {
// 	return (
// 		<section id="why-choose-us" className="bg-gray-50">
// 			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
// 				<h2 className="text-3xl font-extrabold text-brand-red mb-10">
// 					{content.heading}
// 				</h2>
// 				<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-8">
// 					{content.items.map((item, i) => {
// 						const Icon = ICON_MAP[item.icon];
// 						return (
// 							<div key={i} className="flex flex-col gap-2">
// 								{Icon && (
// 									<div className="w-10 h-10 bg-brand-red/10 rounded-lg flex items-center justify-center mb-1">
// 										<Icon size={20} className="text-brand-red" />
// 									</div>
// 								)}
// 								<h3 className="font-semibold text-gray-900">{item.title}</h3>
// 								<p className="text-sm text-gray-500">{item.description}</p>
// 							</div>
// 						);
// 					})}
// 				</div>
// 			</div>
// 		</section>
// 	);
// }



// components/public/home/WhyChooseUs.tsx
import {
  Building2,
  ShieldCheck,
  MapPin,
  Clock,
  Users,
  TrendingUp,
} from "lucide-react";

const REASONS = [
  {
    icon: Building2,
    title: "Quality Construction",
    description:
      "Every Jimo project is built to the highest construction standards, using premium materials and experienced contractors.",
    highlight: false,
  },
  {
    icon: ShieldCheck,
    title: "Transparent Processes",
    description:
      "We maintain clear, open communication at every stage — from land acquisition to keys in hand.",
    highlight: true,
  },
  {
    icon: MapPin,
    title: "Prime Locations",
    description:
      "Our developments are strategically positioned in high-demand Lagos corridors with strong capital appreciation potential.",
    highlight: false,
  },
  {
    icon: Clock,
    title: "Timely Delivery",
    description:
      "We respect your investment timeline. Our projects are structured for on-schedule delivery without compromising quality.",
    highlight: false,
  },
  {
    icon: Users,
    title: "Experienced Team",
    description:
      "Our team combines deep real estate expertise, engineering excellence, and market insight built over years in the Lagos market.",
    highlight: false,
  },
  {
    icon: TrendingUp,
    title: "Strong Growth Potential",
    description:
      "Each project is chosen for its investment fundamentals — strong rental demand, capital growth, and long-term value creation.",
    highlight: false,
  },
];

export default function WhyChooseUs() {
  return (
    <section className="w-full bg-white py-16 md:py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <h2 className="text-3xl md:text-4xl font-bold text-[#CC1718] mb-12 max-w-xs leading-tight">
          Why Investors
          <br />
          Choose Us
        </h2>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-10">
          {REASONS.map((reason) => {
            const Icon = reason.icon;
            return (
              <div key={reason.title} className="flex flex-col gap-3">
                {/* Icon */}
                <div
                  className={`w-10 h-10 flex items-center justify-center rounded-sm shrink-0 ${
                    reason.highlight
                      ? "bg-[#CC1718]"
                      : "bg-transparent"
                  }`}
                >
                  <Icon
                    className={`h-5 w-5 ${
                      reason.highlight ? "text-white" : "text-[#CC1718]"
                    }`}
                  />
                </div>

                <div>
                  <h3 className="text-base font-bold text-gray-900">
                    {reason.title}
                  </h3>
                  <p className="mt-1.5 text-sm text-gray-600 leading-relaxed">
                    {reason.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}