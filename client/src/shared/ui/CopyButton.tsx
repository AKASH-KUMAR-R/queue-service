import { useState } from "react";

import { Check, Copy } from "lucide-react";

interface CopyButtonProps {
	value: string;
	label?: string;
	size?: "sm" | "md" | "lg";
}

export function CopyButton({
	value,
	label = "Copy",
	size = "md",
}: CopyButtonProps) {
	const [copied, setCopied] = useState(false);
	const [error, setError] = useState(false);

	const handleCopy = async () => {
		try {
			// Try modern clipboard API first
			if (navigator.clipboard && navigator.clipboard.writeText) {
				await navigator.clipboard.writeText(value);
				setCopied(true);
				setError(false);
				setTimeout(() => setCopied(false), 2000);
			} else {
				// Fallback to older method
				const textArea = document.createElement("textarea");
				textArea.value = value;
				textArea.style.position = "fixed";
				textArea.style.left = "-999999px";
				document.body.appendChild(textArea);
				textArea.select();
				try {
					document.execCommand("copy");
					setCopied(true);
					setError(false);
					setTimeout(() => setCopied(false), 2000);
				} catch (err) {
					console.error("Fallback copy failed:", err);
					setError(true);
					setTimeout(() => setError(false), 2000);
				}
				document.body.removeChild(textArea);
			}
		} catch (err) {
			console.error("Failed to copy:", err);
			setError(true);
			setTimeout(() => setError(false), 2000);
		}
	};

	const sizeClasses = {
		sm: "px-2 py-1 text-xs",
		md: "px-3 py-2 text-sm",
		lg: "px-4 py-2.5 text-base",
	};

	const iconSize = {
		sm: "w-3 h-3",
		md: "w-4 h-4",
		lg: "w-5 h-5",
	};

	return (
		<button
			type="button"
			onClick={handleCopy}
			className={`inline-flex items-center gap-2 text-neutral-700 hover:bg-neutral-100 rounded transition-colors ${sizeClasses[size]}`}
			aria-label={copied ? "Copied to clipboard" : "Copy to clipboard"}
		>
			{copied ? (
				<>
					<Check className={`${iconSize[size]} text-green-600`} />
					<span>Copied!</span>
				</>
			) : error ? (
				<>
					<Copy className={iconSize[size]} />
					<span>Failed to copy</span>
				</>
			) : (
				<>
					<Copy className={iconSize[size]} />
					<span>{label}</span>
				</>
			)}
		</button>
	);
}
