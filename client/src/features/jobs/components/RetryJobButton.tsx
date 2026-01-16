import { RotateCw } from "lucide-react";

interface RetryJobButtonProps {
	jobId: string;
}

export function RetryJobButton({ jobId }: RetryJobButtonProps) {
	const handleRetry = () => {
		console.log("Retry job:", jobId);
	};

	return (
		<button
			onClick={handleRetry}
			className="flex items-center gap-1 px-2 py-1 text-xs text-blue-700 hover:bg-blue-50 rounded"
			title="Retry job"
		>
			<RotateCw className="w-3 h-3" />
			Retry
		</button>
	);
}
