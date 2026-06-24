import Image from "next/image";
import type { ProjectGalleryImage } from "@/lib/types/project-detail";

export interface GalleryGridProps {
  images: ProjectGalleryImage[];
}

export function ProjectGalleryGrid({ images }: GalleryGridProps) {
  const [primary, ...rest] = images;

  if (!primary) {
    return null;
  }

  return (
    <div className="grid aspect-[4/3] grid-cols-2 grid-rows-2 gap-3 sm:aspect-[16/9]">
      <div className="relative row-span-2 overflow-hidden rounded-2xl">
        <Image
          src={primary.src}
          alt={primary.alt}
          fill
          sizes="(min-width: 640px) 50vw, 100vw"
          className="object-cover"
        />
      </div>
      {rest.map((image) => (
        <div key={image.id} className="relative overflow-hidden rounded-2xl">
          <Image src={image.src} alt={image.alt} fill sizes="50vw" className="object-cover" />
        </div>
      ))}
    </div>
  );
}