// import type { Metadata } from "next";
// import { notFound } from "next/navigation";
// import Image from "next/image";
// import Link from "next/link";
// import { ArrowUpRight } from "lucide-react";
// import { Container } from "@/components/ui/Container";
// import { CtaBanner } from "@/components/public/CtaBanner";
// import { AuthorAvatar } from "@/components/admin/ui/AuthorAvatar";
// import { formatDate } from "@/lib/utils/helpers";
// import { getPublishedInsightBySlug } from "@/lib/db/queries/insights";
// import { siteConfig } from "@/lib/data/site";

// export const revalidate = 60;

// interface InsightPageProps {
// 	params: Promise<{ slug: string }>;
// }

// export async function generateMetadata({
// 	params,
// }: InsightPageProps): Promise<Metadata> {
// 	const { slug } = await params;
// 	const insight = await getPublishedInsightBySlug(slug);
// 	if (!insight) return { title: "Article Not Found" };
// 	return { title: insight.title, description: insight.excerpt };
// }

// export default async function InsightDetailPage({ params }: InsightPageProps) {
// 	const { slug } = await params;
// 	const insight = await getPublishedInsightBySlug(slug);

// 	if (!insight) notFound();

// 	return (
// 		<>
// 			<section className="bg-cream-100 py-16">
// 				<Container className="max-w-2xl">
// 					<span className="inline-flex rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-red-600">
// 						{insight.categoryLabel}
// 					</span>
// 					<h1 className="mt-4 text-3xl font-bold tracking-tight text-ink-950 sm:text-4xl">
// 						{insight.title}
// 					</h1>

// 					<div className="mt-4 flex items-center gap-3">
// 						<AuthorAvatar
// 							name={insight.author.name}
// 							avatarUrl={insight.author.avatarUrl}
// 							size={36}
// 						/>
// 						<div>
// 							<p className="text-sm font-semibold text-ink-950">
// 								{insight.author.name}
// 							</p>
// 							<p className="text-xs text-stone-500">
// 								{formatDate(insight.publishedAt)} &middot;{" "}
// 								{insight.readTimeMinutes} min read
// 							</p>
// 						</div>
// 					</div>
// 				</Container>
// 			</section>

// 			<article className="bg-cream-50 py-16">
// 				<Container className="max-w-2xl">
// 					{insight.coverImage.src ? (
// 						<div className="relative aspect-[16/9] overflow-hidden rounded-3xl">
// 							<Image
// 								src={insight.coverImage.src}
// 								alt={insight.coverImage.alt}
// 								fill
// 								sizes="(min-width: 1024px) 700px, 100vw"
// 								className="object-cover"
// 							/>
// 						</div>
// 					) : null}

// 					<div className="mt-10 space-y-6 text-base leading-relaxed text-stone-700">
// 						{insight.body.map((block) =>
// 							block.type === "paragraph" ? (
// 								<p key={block.id}>{block.text}</p>
// 							) : (
// 								<div
// 									key={block.id}
// 									className="relative aspect-[16/9] overflow-hidden rounded-2xl"
// 								>
// 									<Image
// 										src={block.src}
// 										alt={block.alt}
// 										fill
// 										sizes="(min-width: 1024px) 700px, 100vw"
// 										className="object-cover"
// 									/>
// 								</div>
// 							),
// 						)}
// 					</div>

// 					{insight.relatedProject ? (
// 						<Link
// 							href={`/projects/${insight.relatedProject.slug}`}
// 							className="mt-10 flex items-center justify-between rounded-2xl border border-stone-200 bg-white p-5 transition-colors hover:border-red-200 hover:bg-red-50"
// 						>
// 							<div>
// 								<p className="text-xs font-medium uppercase tracking-wide text-stone-500">
// 									Related Project
// 								</p>
// 								<p className="mt-1 text-base font-bold text-ink-950">
// 									{insight.relatedProject.name}
// 								</p>
// 							</div>
// 							<ArrowUpRight className="h-5 w-5 text-red-600" />
// 						</Link>
// 					) : null}
// 				</Container>
// 			</article>

// 			<CtaBanner
// 				eyebrow="Start a Conversation"
// 				title="Want to talk through what this means for you?"
// 				description="Our team is available to discuss current projects, upcoming developments, and partnership opportunities."
// 				primaryCta={{
// 					label: "Register Interest",
// 					href: siteConfig.registerInterestHref,
// 				}}
// 				secondaryCta={{ label: "Speak With Our Team", href: "/contact" }}
// 			/>
// 		</>
// 	);
// }



// app/(public)/insights/[slug]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { CtaBanner } from "@/components/public/CtaBanner";
import { AuthorAvatar } from "@/components/admin/ui/AuthorAvatar";
import { formatDate } from "@/lib/utils/helpers";
import { renderInsightContentHtml } from "@/lib/utils/tiptap-render";
import { getPublishedInsightBySlug } from "@/lib/db/queries/insights";
import { siteConfig } from "@/lib/data/site";

export const revalidate = 60;

interface InsightPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: InsightPageProps): Promise<Metadata> {
  const { slug } = await params;
  const insight = await getPublishedInsightBySlug(slug);
  if (!insight) return { title: "Article Not Found" };
  return { title: insight.title, description: insight.excerpt };
}

export default async function InsightDetailPage({ params }: InsightPageProps) {
  const { slug } = await params;
  const insight = await getPublishedInsightBySlug(slug);

  if (!insight) notFound();

  const contentHtml = renderInsightContentHtml(insight.content);

  return (
    <>
      <section className="bg-cream-100 py-16">
        <Container className="max-w-2xl">
          <span className="inline-flex rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-red-600">
            {insight.categoryLabel}
          </span>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-ink-950 sm:text-4xl">{insight.title}</h1>

          <div className="mt-4 flex items-center gap-3">
            <AuthorAvatar name={insight.author.name} avatarUrl={insight.author.avatarUrl} size={36} />
            <div>
              <p className="text-sm font-semibold text-ink-950">{insight.author.name}</p>
              <p className="text-xs text-stone-500">
                {formatDate(insight.publishedAt)} &middot; {insight.readTimeMinutes} min read
              </p>
            </div>
          </div>
        </Container>
      </section>

      <article className="bg-cream-50 py-16">
        <Container className="max-w-2xl">
          {insight.coverImage.src ? (
            <div className="relative aspect-[16/9] overflow-hidden rounded-3xl">
              <Image
                src={insight.coverImage.src}
                alt={insight.coverImage.alt}
                fill
                sizes="(min-width: 1024px) 700px, 100vw"
                className="object-cover"
              />
            </div>
          ) : null}

          <div
            className="prose prose-stone mt-10 max-w-none prose-headings:font-bold prose-a:text-red-600 prose-img:rounded-2xl"
            dangerouslySetInnerHTML={{ __html: contentHtml }}
          />

          {insight.relatedProject ? (
            <Link
              href={`/projects/${insight.relatedProject.slug}`}
              className="mt-10 flex items-center justify-between rounded-2xl border border-stone-200 bg-white p-5 transition-colors hover:border-red-200 hover:bg-red-50"
            >
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-stone-500">Related Project</p>
                <p className="mt-1 text-base font-bold text-ink-950">{insight.relatedProject.name}</p>
              </div>
              <ArrowUpRight className="h-5 w-5 text-red-600" />
            </Link>
          ) : null}
        </Container>
      </article>

      <CtaBanner
        eyebrow="Start a Conversation"
        title="Want to talk through what this means for you?"
        description="Our team is available to discuss current projects, upcoming developments, and partnership opportunities."
        primaryCta={{ label: "Register Interest", href: siteConfig.registerInterestHref }}
        secondaryCta={{ label: "Speak With Our Team", href: "/contact" }}
      />
    </>
  );
}