
import Image from "next/image";

const PALETTE = [
	"#DC2626",
	"#D97706",
	"#059669",
	"#2563EB",
	"#7C3AED",
	"#DB2777",
	"#0891B2",
];

function initialsFromName(name: string): string {
	const parts = name.trim().split(/\s+/).filter(Boolean);
	if (parts.length === 0) return "?";
	if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
	return (parts[0]![0]! + parts[parts.length - 1]![0]!).toUpperCase();
}

function colorFromName(name: string): string {
	let hash = 0;
	for (let i = 0; i < name.length; i++)
		hash = name.charCodeAt(i) + ((hash << 5) - hash);
	return PALETTE[Math.abs(hash) % PALETTE.length]!;
}

export function AuthorAvatar({
	name,
	avatarUrl,
	size = 32,
}: {
	name: string;
	avatarUrl?: string | null;
	size?: number;
}) {
	if (avatarUrl) {
		return (
			<Image
				src={avatarUrl}
				alt={name}
				style={{ width: size, height: size }}
				className="shrink-0 rounded-full object-cover"
			/>
		);
	}

	return (
		<span
			style={{
				width: size,
				height: size,
				backgroundColor: colorFromName(name || "?"),
				fontSize: size * 0.4,
			}}
			className="flex shrink-0 items-center justify-center rounded-full font-bold text-white"
			aria-label={name}
		>
			{initialsFromName(name || "?")}
		</span>
	);
}
