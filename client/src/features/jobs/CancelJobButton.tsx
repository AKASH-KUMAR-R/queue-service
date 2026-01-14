import { X } from "lucide-react";

interface CancelJobButtonProps {
	jobId: string;
}

export function CancelJobButton({ jobId }: CancelJobButtonProps) {
	const handleCancel = () => {
		console.log("Cancel job:", jobId);
	};

	return (
		<button
			onClick={handleCancel}
			className="flex items-center gap-1 px-2 py-1 text-xs text-red-700 hover:bg-red-50 rounded"
			title="Cancel job"
		>
			<X className="w-3 h-3" />
			Cancel
		</button>
	);
}
