import { X } from "lucide-react";

import { Button } from "./button";
import { Dialog, DialogClose, DialogContent, DialogTitle } from "./dialog";

interface ConfirmDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	title: string;
	message: string;
	confirmLabel: string;
	onConfirm: () => void;
	variant?:
		| "link"
		| "outline"
		| "default"
		| "destructive"
		| "secondary"
		| "ghost"
		| null
		| undefined;
}

export function ConfirmDialog({
	open,
	onOpenChange,
	title,
	message,
	confirmLabel,
	onConfirm,
	variant = "default",
}: ConfirmDialogProps) {
	const handleConfirm = () => {
		onConfirm();
		onOpenChange(false);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent showCloseButton={false}>
				<div className="flex items-start justify-between p-2">
					<div className="flex items-center gap-3">
						<DialogTitle>{title}</DialogTitle>
					</div>
					<DialogClose>
						<X className="w-5 h-5" />
					</DialogClose>
				</div>
				<div className="p-2">
					<p className="text-sm">{message}</p>
				</div>
				<div className="flex items-center justify-end gap-3 p-2 ">
					<Button type="button" onClick={() => onOpenChange(false)}>
						Cancel
					</Button>
					<Button
						type="button"
						variant={variant}
						onClick={handleConfirm}
					>
						{confirmLabel}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
