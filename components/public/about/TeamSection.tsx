//@components/public/about/TeamSection
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

export interface TeamMemberDisplay {
	id: string;
	name: string;
	role: string;
	bio: string;
	photo: { src: string; alt: string };
}

export function TeamSection({ members }: { members: TeamMemberDisplay[] }) {
	return (
		<section className="bg-cream-50 py-20">
			<Container>
				<SectionHeading
					align="center"
					eyebrow="Our Team"
					title="The people behind every development"
					description="A small, structured team overseeing development, sales, and delivery across every Jimo project."
					className="mx-auto"
				/>

				<div className="mx-auto mt-12 grid max-w-3xl gap-6 sm:grid-cols-2">
					{members.map((member) => (
						<div
							key={member.id}
							className="flex flex-col items-center rounded-3xl border border-stone-200 bg-white p-6 text-center"
						>
							<div className="relative h-28 w-28 overflow-hidden rounded-full">
								<Image
									src={member.photo.src}
									alt={member.photo.alt}
									fill
									sizes="112px"
									className="object-cover"
								/>
							</div>
							<h3 className="mt-5 text-base font-bold text-ink-950">
								{member.name}
							</h3>
							<p className="text-sm font-medium text-red-600">{member.role}</p>
							<p className="mt-3 text-sm leading-relaxed text-stone-600">
								{member.bio}
							</p>
						</div>
					))}
				</div>
			</Container>
		</section>
	);
}