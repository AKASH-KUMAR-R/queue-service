import { useState } from "react";

import { Play } from "lucide-react";

import type { Queue } from "../../entities/queue/types";
import { ConfirmDialog } from "../../shared/ui/ConfirmDialog";

interface ResumeQueueButtonProps {
	queue: Queue;
	compact?: boolean;
}

export function ResumeQueueButton({
	queue,
	compact = false,
}: ResumeQueueButtonProps) {
	const [showConfirm, setShowConfirm] = useState(false);

	const handleResume = () => {
		console.log("Resume queue:", queue.id);
	};

	if (compact) {
		return (
			<>
				<button
					onClick={() => setShowConfirm(true)}
					className="text-blue-600 hover:text-blue-700"
					title="Resume queue"
				>
					<Play className="w-4 h-4" />
				</button>

				<ConfirmDialog
					open={showConfirm}
					onOpenChange={setShowConfirm}
					title="Resume Queue"
					message={`Are you sure you want to resume "${queue.name}"? The queue will start processing pending jobs.`}
					confirmLabel="Resume Queue"
					onConfirm={handleResume}
					variant="primary"
				/>
			</>
		);
	}

	return (
		<>
			<button
				onClick={() => setShowConfirm(true)}
				className="flex items-center gap-2 px-3 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors"
			>
				<Play className="w-4 h-4" />
				Resume
			</button>

			<ConfirmDialog
				open={showConfirm}
				onOpenChange={setShowConfirm}
				title="Resume Queue"
				message={`Are you sure you want to resume "${queue.name}"? The queue will start processing pending jobs.`}
				confirmLabel="Resume Queue"
				onConfirm={handleResume}
				variant="primary"
			/>
		</>
	);
}
