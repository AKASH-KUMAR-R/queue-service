import { useState } from "react";
import { useParams } from "react-router-dom";

import { JobsTable } from "@widgets/JobsTable";

import { EmptyState } from "@shared/ui/EmptyState";
import { LoadingState } from "@shared/ui/LoadingState";

export function JobsPage() {
	const { queueId } = useParams<{ queueId: string }>();
	const [isLoading] = useState(false);

	if (!queueId) {
		return (
			<div className="p-8">
				<div className="mb-6">
					<h1 className="text-2xl font-semibold text-foreground">
						Jobs
					</h1>
					<p className="text-sm text-muted-foreground mt-1">
						View and manage job execution
					</p>
				</div>
				<EmptyState
					title="No queue selected"
					description="Select a queue from the Queues view to see its jobs"
				/>
			</div>
		);
	}

	if (isLoading) {
		return (
			<div className="p-8">
				<div className="mb-6">
					<h1 className="text-2xl font-semibold text-foreground">
						Jobs
					</h1>
				</div>
				<LoadingState />
			</div>
		);
	}

	return (
		<div className="p-8">
			<div className="mb-6">
				<h1 className="text-2xl font-semibold text-foreground">Jobs</h1>
				<p className="text-sm text-muted-foreground mt-1">
					Queue: <span className="font-mono">{queueId}</span>
				</p>
			</div>

			<JobsTable queueId={queueId} />
		</div>
	);
}
