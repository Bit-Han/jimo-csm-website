"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, X } from "lucide-react";
import { updateOwnAvatar, updateOwnName } from "@/lib/actions/admin/profile";
import { ImageUploadField } from "@/components/admin/media/ImageUploadField";
import type { AuthenticatedAdminUser } from "@/lib/auth/get-admin-user";

export function EditProfileModal({
	currentUser,
	onClose,
}: {
	currentUser: AuthenticatedAdminUser;
	onClose: () => void;
}) {
	const router = useRouter();
	const [fullName, setFullName] = useState(currentUser.fullName);
	const [avatarUrl, setAvatarUrl] = useState(currentUser.avatarUrl ?? "");
	const [pendingAvatarDeletion, setPendingAvatarDeletion] = useState<
		string | undefined
	>();
	const [isPending, startTransition] = useTransition();
	const [error, setError] = useState<string | null>(null);
	const [saved, setSaved] = useState(false);

	function handleSave() {
		setError(null);
		startTransition(async () => {
			if (fullName.trim() !== currentUser.fullName) {
				const nameResult = await updateOwnName(fullName);
				if (!nameResult.success) {
					setError(nameResult.message);
					return;
				}
			}

			if (avatarUrl !== (currentUser.avatarUrl ?? "")) {
				const avatarResult = await updateOwnAvatar(
					avatarUrl,
					pendingAvatarDeletion,
				);
				if (!avatarResult.success) {
					setError(avatarResult.message);
					return;
				}
			}

			setSaved(true);
			router.refresh();
			setTimeout(() => onClose(), 1000);
		});
	}

	return (
		<>
			<button
				type="button"
				onClick={onClose}
				aria-label="Close"
				className="fixed inset-0 z-40 bg-black/50"
			/>
			<div
				role="dialog"
				aria-modal="true"
				aria-label="Edit Profile"
				className="fixed left-1/2 top-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-stone-200 bg-white p-6 shadow-2xl"
			>
				<div className="flex items-start justify-between">
					<h2 className="text-base font-bold text-ink-950">Edit Profile</h2>
					<button
						type="button"
						onClick={onClose}
						className="text-stone-400 hover:text-ink-950"
					>
						<X className="h-5 w-5" />
					</button>
				</div>

				<div className="mt-5 space-y-4">
					<ImageUploadField
						label="Profile Photo"
						value={avatarUrl}
						altValue={currentUser.fullName}
						onChange={(url, _alt, previousUrl) => {
							setPendingAvatarDeletion(previousUrl);
							setAvatarUrl(url);
						}}
						folder="jimo-property/admin-avatars"
						aspectClass="aspect-square"
					/>

					<div>
						<label className="mb-1.5 block text-sm font-medium text-ink-950">
							Full Name
						</label>
						<input
							type="text"
							value={fullName}
							onChange={(e) => setFullName(e.target.value)}
							className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2.5 text-sm text-ink-950 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/20"
						/>
					</div>

					{error ? (
						<p className="text-sm font-medium text-red-500">{error}</p>
					) : null}

					<div className="flex justify-end gap-3 pt-2">
						<button
							type="button"
							onClick={onClose}
							className="rounded-xl border border-stone-200 px-4 py-2.5 text-sm font-semibold text-ink-950 hover:bg-stone-50"
						>
							Cancel
						</button>
						<button
							type="button"
							onClick={handleSave}
							disabled={isPending || !fullName.trim()}
							className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
						>
							{isPending ? (
								<Loader2 className="h-4 w-4 animate-spin" />
							) : saved ? (
								<Check className="h-4 w-4" />
							) : null}
							{saved ? "Saved!" : "Save Changes"}
						</button>
					</div>
				</div>
			</div>
		</>
	);
}
