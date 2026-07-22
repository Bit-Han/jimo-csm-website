interface SuggestInputProps {
	listId: string;
	value: string;
	onChange: (value: string) => void;
	suggestions: string[];
	placeholder?: string;
	className: string;
}

export function SuggestInput({
	listId,
	value,
	onChange,
	suggestions,
	placeholder,
	className,
}: SuggestInputProps) {
	return (
		<>
			<input
				type="text"
				list={listId}
				value={value}
				onChange={(e) => onChange(e.target.value)}
				placeholder={placeholder}
				className={className}
			/>
			<datalist id={listId}>
				{suggestions.map((s) => (
					<option key={s} value={s} />
				))}
			</datalist>
		</>
	);
}
