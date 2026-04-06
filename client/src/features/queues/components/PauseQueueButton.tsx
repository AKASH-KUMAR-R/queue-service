import { useState } from "react";

import { Pause } from "lucide-react";

import { ConfirmDialog } from "@shared/ui/ConfirmDialog";
import { Button } from "@shared/ui/button";

import type { Queue } from "@entities/queue/types/types";

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
				<Button
					onClick={() => setShowConfirm(true)}
					title="Pause queue"
				>
					<Pause className="w-4 h-4" />
				</Button>

				<ConfirmDialog
					open={showConfirm}
					onOpenChange={setShowConfirm}
					title="Pause Queue"
					message={`Are you sure you want to pause "${queue.label}"? In-progress jobs will complete, but no new jobs will be processed.`}
					confirmLabel="Pause Queue"
					onConfirm={handlePause}
					variant="destructive"
				/>
			</>
		);
	}

	return (
		<>
			<Button onClick={() => setShowConfirm(true)}>
				<Pause className="w-4 h-4" />
				Pause
			</Button>

			<ConfirmDialog
				open={showConfirm}
				onOpenChange={setShowConfirm}
				title="Pause Queue"
				message={`Are you sure you want to pause "${queue.label}"? In-progress jobs will complete, but no new jobs will be processed.`}
				confirmLabel="Pause Queue"
				onConfirm={handlePause}
				variant="destructive"
			/>
		</>
	);
}
