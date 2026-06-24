"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils/helpers";
import type { ProjectFaqItem } from "@/lib/types/project-detail";

export interface FaqAccordionProps {
  items: ProjectFaqItem[];
}

export function FaqAccordion({ items }: FaqAccordionProps) {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);

  return (
    <div className="divide-y divide-stone-100">
      {items.map((item) => {
        const isOpen = item.id === openId;

        return (
          <div key={item.id} className="py-4 first:pt-0 last:pb-0">
            <button
              type="button"
              onClick={() => setOpenId(isOpen ? null : item.id)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 text-left"
            >
              <span className="text-sm font-semibold text-ink-950">{item.question}</span>
              <ChevronDown
                className={cn(
                  "h-4 w-4 shrink-0 text-stone-400 transition-transform",
                  isOpen && "rotate-180 text-red-600",
                )}
              />
            </button>
            {isOpen ? (
              <p className="mt-3 text-sm leading-relaxed text-stone-600">{item.answer}</p>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}