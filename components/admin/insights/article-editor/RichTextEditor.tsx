// // components/admin/insights/article-editor/RichTextEditor.tsx
// "use client";

// import { useCallback, useEffect, useRef, useState } from "react";
// import { useEditor, EditorContent, type JSONContent } from "@tiptap/react";
// import StarterKit from "@tiptap/starter-kit";
// import Image from "@tiptap/extension-image";
// import Link from "@tiptap/extension-link";
// import Underline from "@tiptap/extension-underline";
// import Placeholder from "@tiptap/extension-placeholder";
// import {
// 	Bold as BoldIcon,
// 	Italic as ItalicIcon,
// 	Underline as UnderlineIcon,
// 	Heading1,
// 	Heading2,
// 	Heading3,
// 	List,
// 	ListOrdered,
// 	Quote,
// 	Link2,
// 	Link2Off,
// 	Image as ImageIcon,
// 	Undo2,
// 	Redo2,
// 	Loader2,
// } from "lucide-react";
// import { cn } from "@/lib/utils/helpers";
// import { isValidTiptapDoc, EMPTY_TIPTAP_DOC } from "@/lib/utils/tiptap";

// export interface RichTextEditorProps {
// 	content: JSONContent | null | undefined;
// 	onChange: (json: JSONContent) => void;
// 	uploadFolder?: string;
// 	placeholder?: string;
// }

// function ToolbarButton({
// 	onClick,
// 	active,
// 	disabled,
// 	label,
// 	children,
// }: {
// 	onClick: () => void;
// 	active?: boolean;
// 	disabled?: boolean;
// 	label: string;
// 	children: React.ReactNode;
// }) {
// 	return (
// 		<button
// 			type="button"
// 			onClick={onClick}
// 			disabled={disabled}
// 			aria-label={label}
// 			title={label}
// 			className={cn(
// 				"flex h-8 w-8 items-center justify-center rounded-lg text-stone-500 transition-colors hover:bg-stone-100 hover:text-ink-950 disabled:opacity-40 disabled:hover:bg-transparent",
// 				active && "bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700",
// 			)}
// 		>
// 			{children}
// 		</button>
// 	);
// }

// export function RichTextEditor({
// 	content,
// 	onChange,
// 	uploadFolder = "insights-body",
// 	placeholder = "Start writing the article...",
// }: RichTextEditorProps) {
// 	const fileInputRef = useRef<HTMLInputElement>(null);
// 	const [uploading, setUploading] = useState(false);
// 	const [imagePopover, setImagePopover] = useState<{
// 		src: string;
// 		alt: string;
// 	} | null>(null);
// 	const [linkPopoverOpen, setLinkPopoverOpen] = useState(false);
// 	const [linkValue, setLinkValue] = useState("");

// 	// const editor = useEditor({
// 	// 	immediatelyRender: false,
// 	// 	extensions: [
// 	// 		StarterKit.configure({
// 	// 			heading: { levels: [1, 2, 3] },
// 	// 			link: false,
// 	// 			underline: false,
// 	// 		}),
// 	// 		Underline.configure({}),
// 	// 		Link.configure({
// 	// 			openOnClick: false,
// 	// 			autolink: true,
// 	// 			HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" },
// 	// 		}),
// 	// 		Image.configure({ HTMLAttributes: { class: "rounded-xl" } }),
// 	// 		Placeholder.configure({ placeholder }),
// 	// 	],
// 	// 	content: content && Object.keys(content).length > 0 ? content : "",
// 	// 	editorProps: {
// 	// 		attributes: {
// 	// 			class:
// 	// 				"prose prose-stone max-w-none focus:outline-none min-h-[320px] px-4 py-4 prose-headings:font-bold prose-a:text-red-600 prose-img:rounded-xl",
// 	// 		},
// 	// 	},
// 	// 	onUpdate: ({ editor }) => onChange(editor.getJSON()),
// 	// });

// 	const editor = useEditor({
// 		immediatelyRender: false,
// 		extensions: [
// 			StarterKit.configure({
// 				heading: { levels: [1, 2, 3] },
// 				link: false,
// 				underline: false,
// 			}),
// 			Underline.configure({}),
// 			Link.configure({
// 				openOnClick: false,
// 				autolink: true,
// 				HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" },
// 			}),
// 			Image.configure({ HTMLAttributes: { class: "rounded-xl" } }),
// 			Placeholder.configure({ placeholder }),
// 		],
// 		// Never pass "" or a malformed shape into Tiptap — validate strictly,
// 		// fall back to a real empty doc otherwise. This is defense-in-depth on
// 		// top of the mapper's own guard, in case content ever reaches this
// 		// component from anywhere else (e.g. a future bulk-import script).
// 		content: isValidTiptapDoc(content) ? content : EMPTY_TIPTAP_DOC,
// 		editorProps: {
// 			attributes: {
// 				class:
// 					"prose prose-stone max-w-none focus:outline-none min-h-[320px] px-4 py-4 prose-headings:font-bold prose-a:text-red-600 prose-img:rounded-xl",
// 			},
// 		},
// 		onUpdate: ({ editor }) => onChange(editor.getJSON()),
// 	});

// 	// Keep in sync if the parent resets state externally (e.g. after a save)
// 	const lastExternal = useRef(content);
// 	useEffect(() => {
// 		if (!editor || content === lastExternal.current) return;
// 		lastExternal.current = content;
// 		const safeContent = isValidTiptapDoc(content) ? content : EMPTY_TIPTAP_DOC;
// 		const same =
// 			JSON.stringify(editor.getJSON()) === JSON.stringify(safeContent);
// 		if (!same) editor.commands.setContent(safeContent, { emitUpdate: false });
// 	}, [content, editor]);

// 	const handleImageButtonClick = useCallback(
// 		() => fileInputRef.current?.click(),
// 		[],
// 	);

// 	// async function handleFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
// 	//   const file = e.target.files?.[0];
// 	//   e.target.value = "";
// 	//   if (!file) return;

// 	//   setUploading(true);
// 	//   try {
// 	//     const fd = new FormData();
// 	//     fd.append("file", file);
// 	//     fd.append("folder", uploadFolder);
// 	//     fd.append("altText", "");

// 	//     const res = await fetch("/api/admin/media/upload", { method: "POST", body: fd });
// 	//     const data = await res.json();

// 	//     if (!res.ok || !data.success) throw new Error(data.error ?? "Upload failed.");
// 	//     setImagePopover({ src: data.asset.secureUrl, alt: "" });
// 	//   } catch (err) {
// 	//     console.error("Image upload failed:", err);
// 	//     alert(err instanceof Error ? err.message : "Image upload failed.");
// 	//   } finally {
// 	//     setUploading(false);
// 	//   }
// 	// }

// 	async function handleFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
// 		const file = e.target.files?.[0];
// 		e.target.value = "";
// 		if (!file) return;

// 		setUploading(true);
// 		try {
// 			const fd = new FormData();
// 			fd.append("file", file);
// 			fd.append("folder", uploadFolder);
// 			// Remove altText if your endpoint doesn't process it

// 			// 1. CRITICAL: Fixed path endpoint typo matching your actual storage file
// 			const res = await fetch("/api/admin/storage/upload", {
// 				method: "POST",
// 				body: fd,
// 			});
// 			const data = await res.json();

// 			// 2. CRITICAL: Updated condition looking for data.url instead of data.asset
// 			if (!res.ok || !data.success)
// 				throw new Error(data.error ?? "Upload failed.");

// 			// Set the image src using the exact key returned by your endpoint
// 			setImagePopover({ src: data.url, alt: "" });
// 		} catch (err) {
// 			console.error("Image upload failed:", err);
// 			alert(err instanceof Error ? err.message : "Image upload failed.");
// 		} finally {
// 			setUploading(false);
// 		}
// 	}

// 	function confirmInsertImage() {
// 		if (!editor || !imagePopover) return;
// 		editor
// 			.chain()
// 			.focus()
// 			.setImage({ src: imagePopover.src, alt: imagePopover.alt })
// 			.run();
// 		setImagePopover(null);
// 	}

// 	function openLinkPopover() {
// 		if (!editor) return;
// 		const existing = editor.getAttributes("link").href as string | undefined;
// 		setLinkValue(existing ?? "");
// 		setLinkPopoverOpen(true);
// 	}

// 	function applyLink() {
// 		if (!editor) return;
// 		const url = linkValue.trim();
// 		if (!url) {
// 			editor.chain().focus().extendMarkRange("link").unsetLink().run();
// 		} else {
// 			editor
// 				.chain()
// 				.focus()
// 				.extendMarkRange("link")
// 				.setLink({ href: url })
// 				.run();
// 		}
// 		setLinkPopoverOpen(false);
// 	}

// 	function removeLink() {
// 		editor?.chain().focus().extendMarkRange("link").unsetLink().run();
// 		setLinkPopoverOpen(false);
// 	}

// 	if (!editor) {
// 		return (
// 			<div className="flex min-h-[380px] items-center justify-center rounded-xl border border-stone-200 bg-stone-50">
// 				<Loader2 className="h-5 w-5 animate-spin text-stone-400" />
// 			</div>
// 		);
// 	}

// 	return (
// 		<div className="rounded-xl border border-stone-200 bg-white">
// 			<div className="flex flex-wrap items-center gap-0.5 border-b border-stone-100 p-2">
// 				<ToolbarButton
// 					label="Bold"
// 					active={editor.isActive("bold")}
// 					onClick={() => editor.chain().focus().toggleBold().run()}
// 				>
// 					<BoldIcon className="h-4 w-4" />
// 				</ToolbarButton>
// 				<ToolbarButton
// 					label="Italic"
// 					active={editor.isActive("italic")}
// 					onClick={() => editor.chain().focus().toggleItalic().run()}
// 				>
// 					<ItalicIcon className="h-4 w-4" />
// 				</ToolbarButton>
// 				<ToolbarButton
// 					label="Underline"
// 					active={editor.isActive("underline")}
// 					onClick={() => editor.chain().focus().toggleUnderline().run()}
// 				>
// 					<UnderlineIcon className="h-4 w-4" />
// 				</ToolbarButton>

// 				<span className="mx-1 h-5 w-px bg-stone-200" />

// 				<ToolbarButton
// 					label="Heading 1"
// 					active={editor.isActive("heading", { level: 1 })}
// 					onClick={() =>
// 						editor.chain().focus().toggleHeading({ level: 1 }).run()
// 					}
// 				>
// 					<Heading1 className="h-4 w-4" />
// 				</ToolbarButton>
// 				<ToolbarButton
// 					label="Heading 2"
// 					active={editor.isActive("heading", { level: 2 })}
// 					onClick={() =>
// 						editor.chain().focus().toggleHeading({ level: 2 }).run()
// 					}
// 				>
// 					<Heading2 className="h-4 w-4" />
// 				</ToolbarButton>
// 				<ToolbarButton
// 					label="Heading 3"
// 					active={editor.isActive("heading", { level: 3 })}
// 					onClick={() =>
// 						editor.chain().focus().toggleHeading({ level: 3 }).run()
// 					}
// 				>
// 					<Heading3 className="h-4 w-4" />
// 				</ToolbarButton>

// 				<span className="mx-1 h-5 w-px bg-stone-200" />

// 				<ToolbarButton
// 					label="Bullet list"
// 					active={editor.isActive("bulletList")}
// 					onClick={() => editor.chain().focus().toggleBulletList().run()}
// 				>
// 					<List className="h-4 w-4" />
// 				</ToolbarButton>
// 				<ToolbarButton
// 					label="Numbered list"
// 					active={editor.isActive("orderedList")}
// 					onClick={() => editor.chain().focus().toggleOrderedList().run()}
// 				>
// 					<ListOrdered className="h-4 w-4" />
// 				</ToolbarButton>
// 				<ToolbarButton
// 					label="Quote"
// 					active={editor.isActive("blockquote")}
// 					onClick={() => editor.chain().focus().toggleBlockquote().run()}
// 				>
// 					<Quote className="h-4 w-4" />
// 				</ToolbarButton>

// 				<span className="mx-1 h-5 w-px bg-stone-200" />

// 				<div className="relative">
// 					<ToolbarButton
// 						label="Link"
// 						active={editor.isActive("link")}
// 						onClick={openLinkPopover}
// 					>
// 						<Link2 className="h-4 w-4" />
// 					</ToolbarButton>

// 					{linkPopoverOpen ? (
// 						<>
// 							<button
// 								type="button"
// 								aria-label="Close"
// 								onClick={() => setLinkPopoverOpen(false)}
// 								className="fixed inset-0 z-10"
// 							/>
// 							<div className="absolute left-0 top-9 z-20 w-72 rounded-xl border border-stone-200 bg-white p-3 shadow-lg">
// 								<label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-stone-500">
// 									Link URL
// 								</label>
// 								<input
// 									type="text"
// 									value={linkValue}
// 									onChange={(e) => setLinkValue(e.target.value)}
// 									onKeyDown={(e) => e.key === "Enter" && applyLink()}
// 									placeholder="https:// or /projects/slug"
// 									autoFocus
// 									className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/20"
// 								/>
// 								<div className="mt-2 flex justify-end gap-2">
// 									{editor.isActive("link") ? (
// 										<button
// 											type="button"
// 											onClick={removeLink}
// 											className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50"
// 										>
// 											<Link2Off className="h-3.5 w-3.5" />
// 											Remove
// 										</button>
// 									) : null}
// 									<button
// 										type="button"
// 										onClick={applyLink}
// 										className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700"
// 									>
// 										Apply
// 									</button>
// 								</div>
// 							</div>
// 						</>
// 					) : null}
// 				</div>

// 				<div className="relative">
// 					<ToolbarButton
// 						label="Insert image"
// 						disabled={uploading}
// 						onClick={handleImageButtonClick}
// 					>
// 						{uploading ? (
// 							<Loader2 className="h-4 w-4 animate-spin" />
// 						) : (
// 							<ImageIcon className="h-4 w-4" />
// 						)}
// 					</ToolbarButton>
// 					<input
// 						ref={fileInputRef}
// 						type="file"
// 						accept="image/jpeg,image/png,image/webp,image/gif"
// 						onChange={handleFileSelected}
// 						className="sr-only"
// 					/>

// 					{imagePopover ? (
// 						<>
// 							<button
// 								type="button"
// 								aria-label="Close"
// 								onClick={() => setImagePopover(null)}
// 								className="fixed inset-0 z-10"
// 							/>
// 							<div className="absolute left-0 top-9 z-20 w-72 rounded-xl border border-stone-200 bg-white p-3 shadow-lg">
// 								{/* eslint-disable-next-line @next/next/no-img-element */}
// 								<img
// 									src={imagePopover.src}
// 									alt=""
// 									className="mb-2 h-28 w-full rounded-lg object-cover"
// 								/>
// 								<label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-stone-500">
// 									Alt text <span className="text-red-500">*</span>
// 								</label>
// 								<input
// 									type="text"
// 									value={imagePopover.alt}
// 									onChange={(e) =>
// 										setImagePopover((p) =>
// 											p ? { ...p, alt: e.target.value } : p,
// 										)
// 									}
// 									placeholder="Describe this image for accessibility and SEO"
// 									autoFocus
// 									className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/20"
// 								/>
// 								<div className="mt-2 flex justify-end gap-2">
// 									<button
// 										type="button"
// 										onClick={() => setImagePopover(null)}
// 										className="rounded-lg px-3 py-1.5 text-xs font-medium text-stone-500 hover:bg-stone-50"
// 									>
// 										Cancel
// 									</button>
// 									<button
// 										type="button"
// 										onClick={confirmInsertImage}
// 										disabled={!imagePopover.alt.trim()}
// 										className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-50"
// 									>
// 										Insert
// 									</button>
// 								</div>
// 							</div>
// 						</>
// 					) : null}
// 				</div>

// 				<span className="mx-1 h-5 w-px bg-stone-200" />

// 				<ToolbarButton
// 					label="Undo"
// 					disabled={!editor.can().undo()}
// 					onClick={() => editor.chain().focus().undo().run()}
// 				>
// 					<Undo2 className="h-4 w-4" />
// 				</ToolbarButton>
// 				<ToolbarButton
// 					label="Redo"
// 					disabled={!editor.can().redo()}
// 					onClick={() => editor.chain().focus().redo().run()}
// 				>
// 					<Redo2 className="h-4 w-4" />
// 				</ToolbarButton>
// 			</div>

// 			<EditorContent editor={editor} />
// 		</div>
// 	);
// }




// components/admin/insights/article-editor/RichTextEditor.tsx
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useEditor, EditorContent, type JSONContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import {
	Bold as BoldIcon,
	Italic as ItalicIcon,
	Underline as UnderlineIcon,
	Heading1,
	Heading2,
	Heading3,
	List,
	ListOrdered,
	Quote,
	Link2,
	Link2Off,
	Image as ImageIcon,
	Undo2,
	Redo2,
	Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils/helpers";
import { isValidTiptapDoc, EMPTY_TIPTAP_DOC } from "@/lib/utils/tiptap";

export interface RichTextEditorProps {
	content: JSONContent | null | undefined;
	onChange: (json: JSONContent) => void;
	uploadFolder?: string;
	placeholder?: string;
}

function ToolbarButton({
	onClick,
	active,
	disabled,
	label,
	children,
}: {
	onClick: () => void;
	active?: boolean;
	disabled?: boolean;
	label: string;
	children: React.ReactNode;
}) {
	return (
		<button
			type="button"
			onClick={onClick}
			disabled={disabled}
			aria-label={label}
			title={label}
			className={cn(
				"flex h-8 w-8 items-center justify-center rounded-lg text-stone-500 transition-colors hover:bg-stone-100 hover:text-ink-950 disabled:opacity-40 disabled:hover:bg-transparent",
				active && "bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700",
			)}
		>
			{children}
		</button>
	);
}

export function RichTextEditor({
	content,
	onChange,
	uploadFolder = "insights-body",
	placeholder = "Start writing the article...",
}: RichTextEditorProps) {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [uploading, setUploading] = useState(false);
	const [imagePopover, setImagePopover] = useState<{
		src: string;
		alt: string;
	} | null>(null);
	const [linkPopoverOpen, setLinkPopoverOpen] = useState(false);
	const [linkValue, setLinkValue] = useState("");

	// Set to true right before this component's own onUpdate pushes a
	// change up to the parent, and checked (then reset) at the top of the
	// sync effect below. This is what makes typing cheap: the parent's
	// content prop DOES change on every keystroke (new object reference,
	// since state.content is replaced in ArticleEditorShell), but that
	// change originated from THIS editor instance, so there is nothing to
	// sync back in — skipping straight past the expensive JSON.stringify
	// comparison, which previously ran on every single keystroke and got
	// slower as the document grew. The comparison only still runs for a
	// genuine external reset (e.g. a future feature that swaps content
	// programmatically without remounting) — an event that in practice
	// almost never happens during normal editing.
	const isInternalUpdate = useRef(false);

	const editor = useEditor({
		immediatelyRender: false,
		extensions: [
			StarterKit.configure({
				heading: { levels: [1, 2, 3] },
				link: false,
				underline: false,
			}),
			Underline.configure({}),
			Link.configure({
				openOnClick: false,
				autolink: true,
				HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" },
			}),
			Image.configure({ HTMLAttributes: { class: "rounded-xl" } }),
			Placeholder.configure({ placeholder }),
		],
		content: isValidTiptapDoc(content) ? content : EMPTY_TIPTAP_DOC,
		editorProps: {
			attributes: {
				class:
					"prose prose-stone max-w-none focus:outline-none min-h-[320px] px-4 py-4 prose-headings:font-bold prose-a:text-red-600 prose-img:rounded-xl",
			},
		},
		onUpdate: ({ editor }) => {
			isInternalUpdate.current = true;
			onChange(editor.getJSON());
		},
	});

	// Only reconciles the editor's content when it changes for a reason
	// OTHER than this editor's own typing — e.g. a future caller swapping
	// content without remounting the component. Cheap on every keystroke:
	// the isInternalUpdate flag short-circuits before any JSON work.
	const lastExternal = useRef(content);
	useEffect(() => {
		if (!editor || content === lastExternal.current) return;
		lastExternal.current = content;

		if (isInternalUpdate.current) {
			// This change came from the editor's own onUpdate — the editor
			// already has this exact content, nothing to do.
			isInternalUpdate.current = false;
			return;
		}

		// Genuine external reset — safe to do the fuller check here since
		// this path is rare, not per-keystroke.
		const safeContent = isValidTiptapDoc(content) ? content : EMPTY_TIPTAP_DOC;
		editor.commands.setContent(safeContent, { emitUpdate: false });
	}, [content, editor]);

	const handleImageButtonClick = useCallback(
		() => fileInputRef.current?.click(),
		[],
	);

	async function handleFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0];
		e.target.value = "";
		if (!file) return;

		setUploading(true);
		try {
			const fd = new FormData();
			fd.append("file", file);
			fd.append("folder", uploadFolder);

			const res = await fetch("/api/admin/storage/upload", {
				method: "POST",
				body: fd,
			});
			const data = await res.json();

			if (!res.ok || !data.success)
				throw new Error(data.error ?? "Upload failed.");

			setImagePopover({ src: data.url, alt: "" });
		} catch (err) {
			console.error("Image upload failed:", err);
			alert(err instanceof Error ? err.message : "Image upload failed.");
		} finally {
			setUploading(false);
		}
	}

	function confirmInsertImage() {
		if (!editor || !imagePopover) return;
		editor
			.chain()
			.focus()
			.setImage({ src: imagePopover.src, alt: imagePopover.alt })
			.run();
		setImagePopover(null);
	}

	function openLinkPopover() {
		if (!editor) return;
		const existing = editor.getAttributes("link").href as string | undefined;
		setLinkValue(existing ?? "");
		setLinkPopoverOpen(true);
	}

	function applyLink() {
		if (!editor) return;
		const url = linkValue.trim();
		if (!url) {
			editor.chain().focus().extendMarkRange("link").unsetLink().run();
		} else {
			editor
				.chain()
				.focus()
				.extendMarkRange("link")
				.setLink({ href: url })
				.run();
		}
		setLinkPopoverOpen(false);
	}

	function removeLink() {
		editor?.chain().focus().extendMarkRange("link").unsetLink().run();
		setLinkPopoverOpen(false);
	}

	if (!editor) {
		return (
			<div className="flex min-h-[380px] items-center justify-center rounded-xl border border-stone-200 bg-stone-50">
				<Loader2 className="h-5 w-5 animate-spin text-stone-400" />
			</div>
		);
	}

	return (
		<div className="rounded-xl border border-stone-200 bg-white">
			<div className="flex flex-wrap items-center gap-0.5 border-b border-stone-100 p-2">
				<ToolbarButton
					label="Bold"
					active={editor.isActive("bold")}
					onClick={() => editor.chain().focus().toggleBold().run()}
				>
					<BoldIcon className="h-4 w-4" />
				</ToolbarButton>
				<ToolbarButton
					label="Italic"
					active={editor.isActive("italic")}
					onClick={() => editor.chain().focus().toggleItalic().run()}
				>
					<ItalicIcon className="h-4 w-4" />
				</ToolbarButton>
				<ToolbarButton
					label="Underline"
					active={editor.isActive("underline")}
					onClick={() => editor.chain().focus().toggleUnderline().run()}
				>
					<UnderlineIcon className="h-4 w-4" />
				</ToolbarButton>

				<span className="mx-1 h-5 w-px bg-stone-200" />

				<ToolbarButton
					label="Heading 1"
					active={editor.isActive("heading", { level: 1 })}
					onClick={() =>
						editor.chain().focus().toggleHeading({ level: 1 }).run()
					}
				>
					<Heading1 className="h-4 w-4" />
				</ToolbarButton>
				<ToolbarButton
					label="Heading 2"
					active={editor.isActive("heading", { level: 2 })}
					onClick={() =>
						editor.chain().focus().toggleHeading({ level: 2 }).run()
					}
				>
					<Heading2 className="h-4 w-4" />
				</ToolbarButton>
				<ToolbarButton
					label="Heading 3"
					active={editor.isActive("heading", { level: 3 })}
					onClick={() =>
						editor.chain().focus().toggleHeading({ level: 3 }).run()
					}
				>
					<Heading3 className="h-4 w-4" />
				</ToolbarButton>

				<span className="mx-1 h-5 w-px bg-stone-200" />

				<ToolbarButton
					label="Bullet list"
					active={editor.isActive("bulletList")}
					onClick={() => editor.chain().focus().toggleBulletList().run()}
				>
					<List className="h-4 w-4" />
				</ToolbarButton>
				<ToolbarButton
					label="Numbered list"
					active={editor.isActive("orderedList")}
					onClick={() => editor.chain().focus().toggleOrderedList().run()}
				>
					<ListOrdered className="h-4 w-4" />
				</ToolbarButton>
				<ToolbarButton
					label="Quote"
					active={editor.isActive("blockquote")}
					onClick={() => editor.chain().focus().toggleBlockquote().run()}
				>
					<Quote className="h-4 w-4" />
				</ToolbarButton>

				<span className="mx-1 h-5 w-px bg-stone-200" />

				<div className="relative">
					<ToolbarButton
						label="Link"
						active={editor.isActive("link")}
						onClick={openLinkPopover}
					>
						<Link2 className="h-4 w-4" />
					</ToolbarButton>

					{linkPopoverOpen ? (
						<>
							<button
								type="button"
								aria-label="Close"
								onClick={() => setLinkPopoverOpen(false)}
								className="fixed inset-0 z-10"
							/>
							<div className="absolute left-0 top-9 z-20 w-72 rounded-xl border border-stone-200 bg-white p-3 shadow-lg">
								<label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-stone-500">
									Link URL
								</label>
								<input
									type="text"
									value={linkValue}
									onChange={(e) => setLinkValue(e.target.value)}
									onKeyDown={(e) => e.key === "Enter" && applyLink()}
									placeholder="https:// or /projects/slug"
									autoFocus
									className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/20"
								/>
								<div className="mt-2 flex justify-end gap-2">
									{editor.isActive("link") ? (
										<button
											type="button"
											onClick={removeLink}
											className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50"
										>
											<Link2Off className="h-3.5 w-3.5" />
											Remove
										</button>
									) : null}
									<button
										type="button"
										onClick={applyLink}
										className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700"
									>
										Apply
									</button>
								</div>
							</div>
						</>
					) : null}
				</div>

				<div className="relative">
					<ToolbarButton
						label="Insert image"
						disabled={uploading}
						onClick={handleImageButtonClick}
					>
						{uploading ? (
							<Loader2 className="h-4 w-4 animate-spin" />
						) : (
							<ImageIcon className="h-4 w-4" />
						)}
					</ToolbarButton>
					<input
						ref={fileInputRef}
						type="file"
						accept="image/jpeg,image/png,image/webp,image/gif"
						onChange={handleFileSelected}
						className="sr-only"
					/>

					{imagePopover ? (
						<>
							<button
								type="button"
								aria-label="Close"
								onClick={() => setImagePopover(null)}
								className="fixed inset-0 z-10"
							/>
							<div className="absolute left-0 top-9 z-20 w-72 rounded-xl border border-stone-200 bg-white p-3 shadow-lg">
								{/* eslint-disable-next-line @next/next/no-img-element */}
								<img
									src={imagePopover.src}
									alt=""
									className="mb-2 h-28 w-full rounded-lg object-cover"
								/>
								<label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-stone-500">
									Alt text <span className="text-red-500">*</span>
								</label>
								<input
									type="text"
									value={imagePopover.alt}
									onChange={(e) =>
										setImagePopover((p) =>
											p ? { ...p, alt: e.target.value } : p,
										)
									}
									placeholder="Describe this image for accessibility and SEO"
									autoFocus
									className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/20"
								/>
								<div className="mt-2 flex justify-end gap-2">
									<button
										type="button"
										onClick={() => setImagePopover(null)}
										className="rounded-lg px-3 py-1.5 text-xs font-medium text-stone-500 hover:bg-stone-50"
									>
										Cancel
									</button>
									<button
										type="button"
										onClick={confirmInsertImage}
										disabled={!imagePopover.alt.trim()}
										className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-50"
									>
										Insert
									</button>
								</div>
							</div>
						</>
					) : null}
				</div>

				<span className="mx-1 h-5 w-px bg-stone-200" />

				<ToolbarButton
					label="Undo"
					disabled={!editor.can().undo()}
					onClick={() => editor.chain().focus().undo().run()}
				>
					<Undo2 className="h-4 w-4" />
				</ToolbarButton>
				<ToolbarButton
					label="Redo"
					disabled={!editor.can().redo()}
					onClick={() => editor.chain().focus().redo().run()}
				>
					<Redo2 className="h-4 w-4" />
				</ToolbarButton>
			</div>

			<EditorContent editor={editor} />
		</div>
	);
}