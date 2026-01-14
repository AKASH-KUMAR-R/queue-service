import { useState } from "react";

import { Pause } from "lucide-react";

import type { Queue } from "../../entities/queue/types";
import { ConfirmDialog } from "../../shared/ui/ConfirmDialog";

interface PauseQueueButtonProps {
	queue: Queue;
	compact?: boolean;
}

export function PauseQueueButton({
	queue,
	compact = false,
}: PauseQueueButtonProps) {
	const [showConfirm, setShowConfirm] = useState(false);

	const handlePause = () => {
		console.log("Pause queue:", queue.id);
	};

	if (compact) {
		return (
			<>
				<button
					onClick={() => setShowConfirm(true)}
					className="text-neutral-400 hover:text-neutral-600"
					title="Pause queue"
				>
					<Pause className="w-4 h-4" />
				</button>

				<ConfirmDialog
					open={showConfirm}
					onOpenChange={setShowConfirm}
					title="Pause Queue"
					message={`Are you sure you want to pause "${queue.name}"? In-progress jobs will complete, but no new jobs will be processed.`}
					confirmLabel="Pause Queue"
					onConfirm={handlePause}
					variant="warning"
				/>
			</>
		);
	}

	return (
		<>
			<button
				onClick={() => setShowConfirm(true)}
				className="flex items-center gap-2 px-3 py-2 text-sm text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded transition-colors"
			>
				<Pause className="w-4 h-4" />
				Pause
			</button>

			<ConfirmDialog
				open={showConfirm}
				onOpenChange={setShowConfirm}
				title="Pause Queue"
				message={`Are you sure you want to pause "${queue.name}"? In-progress jobs will complete, but no new jobs will be processed.`}
				confirmLabel="Pause Queue"
				onConfirm={handlePause}
				variant="warning"
			/>
		</>
	);
}
