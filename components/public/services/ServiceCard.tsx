// components/public/services/ServiceCard.tsx
import Image from "next/image";

type Service = {
	id: string;
	title: string;
	description: string;
	imageUrl: string;
	imageAlt: string;
	reverse: boolean;
};

type Props = { service: Service };

export default function ServiceCard({ service }: Props) {
	return (
		<div className="w-full bg-white rounded-2xl overflow-hidden">
			<div className="grid grid-cols-1 md:grid-cols-2 gap-0">
				{/* Image */}
				<div
					className={`relative min-h-[240px] md:min-h-[320px] p-6 md:p-8 ${
						service.reverse ? "order-1 md:order-2" : "order-2 md:order-1"
					}`}
				>
					<div className="relative w-full h-full min-h-[200px] rounded-xl overflow-hidden">
						<Image
							src={service.imageUrl}
							alt={service.imageAlt}
							fill
							className="object-cover object-center"
							sizes="(max-width: 768px) 100vw, 50vw"
						/>
					</div>
				</div>

				{/* Text */}
				<div
					className={`flex flex-col justify-center px-8 md:px-10 lg:px-12 py-10 md:py-14 ${
						service.reverse ? "order-2 md:order-1" : "order-1 md:order-2"
					}`}
				>
					<h2 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
						{service.title}
					</h2>
					<p className="mt-4 text-sm md:text-base text-gray-600 leading-relaxed">
						{service.description}
					</p>
				</div>
			</div>
		</div>
	);
}
