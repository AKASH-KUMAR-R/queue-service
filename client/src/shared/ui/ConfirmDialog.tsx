import * as RadixDialog from "@radix-ui/react-dialog";
import { AlertTriangle, X } from "lucide-react";

interface ConfirmDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	title: string;
	message: string;
	confirmLabel: string;
	onConfirm: () => void;
	variant?: "primary" | "warning" | "danger";
}

export function ConfirmDialog({
	open,
	onOpenChange,
	title,
	message,
	confirmLabel,
	onConfirm,
	variant = "primary",
}: ConfirmDialogProps) {
	const getButtonStyle = () => {
		switch (variant) {
			case "danger":
				return "bg-red-600 hover:bg-red-700 text-white";
			case "warning":
				return "bg-orange-600 hover:bg-orange-700 text-white";
			default:
				return "bg-blue-600 hover:bg-blue-700 text-white";
		}
	};

	const handleConfirm = () => {
		onConfirm();
		onOpenChange(false);
	};

	return (
		<RadixDialog.Root open={open} onOpenChange={onOpenChange}>
			<RadixDialog.Portal>
				<RadixDialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
				<RadixDialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl max-w-md w-full mx-4 z-50">
					<div className="flex items-start justify-between p-6 border-b border-neutral-200">
						<div className="flex items-center gap-3">
							{variant === "danger" && (
								<AlertTriangle className="w-5 h-5 text-red-600" />
							)}
							{variant === "warning" && (
								<AlertTriangle className="w-5 h-5 text-orange-600" />
							)}
							<RadixDialog.Title className="text-lg font-semibold text-neutral-900">
								{title}
							</RadixDialog.Title>
						</div>
						<RadixDialog.Close className="text-neutral-400 hover:text-neutral-600">
							<X className="w-5 h-5" />
						</RadixDialog.Close>
					</div>
					<div className="p-6">
						<p className="text-sm text-neutral-700">{message}</p>
					</div>
					<div className="flex items-center justify-end gap-3 p-6 border-t border-neutral-200">
						<button
							onClick={() => onOpenChange(false)}
							className="px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 rounded transition-colors"
						>
							Cancel
						</button>
						<button
							onClick={handleConfirm}
							className={`px-4 py-2 text-sm rounded transition-colors ${getButtonStyle()}`}
						>
							{confirmLabel}
						</button>
					</div>
				</RadixDialog.Content>
			</RadixDialog.Portal>
		</RadixDialog.Root>
	);
}
