// components/public/tracking/TrackedLink.tsx
"use client";

import Link, { type LinkProps } from "next/link";
import type { AnchorHTMLAttributes, ReactNode } from "react";
import { trackEvent } from "@/lib/tracking/dispatch";
import type { TrackingEventName } from "@/lib/constants/tracking-events";

interface TrackedLinkProps
	extends LinkProps, Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
	eventName: TrackingEventName;
	metadata?: Record<string, string>;
	children: ReactNode;
}

export function TrackedLink({
	eventName,
	metadata,
	children,
	...linkProps
}: TrackedLinkProps) {
	return (
		<Link
			{...linkProps}
			onClick={(e) => {
				trackEvent(eventName, metadata);
				linkProps.onClick?.(e);
			}}
		>
			{children}
		</Link>
	);
}
