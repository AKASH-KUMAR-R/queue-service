import { useState } from "react";

import { Play } from "lucide-react";

import { ConfirmDialog } from "@shared/ui/ConfirmDialog";
import { Button } from "@shared/ui/button";

import type { Queue } from "@entities/queue/types/types";

type ResumeQueueButtonProps = {
	queue: Queue;
	compact?: boolean;
};

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
				<Button
					onClick={() => setShowConfirm(true)}
					title="Resume queue"
				>
					<Play className="w-4 h-4" />
				</Button>

				<ConfirmDialog
					open={showConfirm}
					onOpenChange={setShowConfirm}
					title="Resume Queue"
					message={`Are you sure you want to resume "${queue.label}"? The queue will start processing pending jobs.`}
					confirmLabel="Resume Queue"
					onConfirm={handleResume}
					variant="primary"
				/>
			</>
		);
	}

	return (
		<>
			<Button onClick={() => setShowConfirm(true)} className="px-3 py-2">
				<Play className="w-4 h-4" />
				Resume
			</Button>

			<ConfirmDialog
				open={showConfirm}
				onOpenChange={setShowConfirm}
				title="Resume Queue"
				message={`Are you sure you want to resume "${queue.label}"? The queue will start processing pending jobs.`}
				confirmLabel="Resume Queue"
				onConfirm={handleResume}
				variant="primary"
			/>
		</>
	);
}
