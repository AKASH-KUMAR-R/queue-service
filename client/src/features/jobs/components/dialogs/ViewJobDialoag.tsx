import { useState } from "react";

import { X } from "lucide-react";

import { Button } from "@shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@shared/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@shared/ui/dialog";
import { Separator } from "@shared/ui/separator";
import { Spinner } from "@shared/ui/spinner";
import {
	formatDateTime,
	formatDurationMilliseconds,
} from "@shared/utils/dateAndTimeUtils";

import { StatusBadge } from "@entities/StatusBadge";
import type { JobEventSearchParams } from "@entities/job/types/types";

import { useJobById } from "@features/jobs/data/getJobById";
import { useJobEventsById } from "@features/jobs/data/getJobEventsById";

import { JobEventsTimeline } from "../job-events/JobEventsList";

type ViewJobDialogProps = {
	jobId: string | null;
	isOpen: boolean;
	onClose: () => void;
};

const ViewJobDialog: React.FC<ViewJobDialogProps> = ({
	jobId,
	isOpen,
	onClose,
}) => {
	const [filters, setFilters] = useState<JobEventSearchParams>({
		page: 1,
		limit: 20,
	});

	const { data: jobRes, isLoading: isJobLoading } = useJobById(jobId);
	const { data: jobEventsRes } = useJobEventsById(jobId, filters);

	const handlePageChange = (newPage: number) => {
		setFilters((prev) => ({ ...prev, page: newPage }));
	};

	const job = jobRes?.data;
	const jobEvents = jobEventsRes?.data.results || [];
	const latency =
		job?.startedAt && job?.createdAt
			? new Date(job.startedAt).getTime() -
				new Date(job.createdAt).getTime()
			: null;
	const latencyLabel =
		latency !== null && latency >= 0
			? formatDurationMilliseconds(latency)
			: "—";
	const jobEventsPagination = {
		page: jobEventsRes?.data.page || 1,
		limit: jobEventsRes?.data.limit || 20,
		totalPages: jobEventsRes?.data.totalPages || 1,
	};

	if (isJobLoading) {
		return (
			<Dialog open={isOpen} onOpenChange={onClose}>
				<DialogContent
					title="Job Details"
					showCloseButton={false}
					className=" w-full md:max-w-6xl"
				>
					<DialogTrigger className=" absolute right-0 top-0">
						<Button type="button" size="sm">
							<X />
						</Button>
					</DialogTrigger>
					<div className="flex items-center justify-center h-48">
						<p>Loading...</p>
						<Spinner size="lg" />
					</div>
				</DialogContent>
			</Dialog>
		);
	}

	if (!job) {
		return (
			<Dialog open={isOpen} onOpenChange={onClose}>
				<DialogContent
					title="Job Details"
					showCloseButton={false}
					className=" w-full max-w-4xl"
				>
					<DialogTrigger className=" absolute right-0 top-0">
						<Button type="button" size="sm">
							<X />
						</Button>
					</DialogTrigger>
					<div className="flex items-center justify-center h-48">
						<p>Job not found.</p>
					</div>
				</DialogContent>
			</Dialog>
		);
	}

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent
				title="Job Details"
				// showCloseButton={false}
				className=" w-full h-[calc(100%-4rem)] sm:max-w-7xl flex flex-col md:flex-row  md:justify-between "
			>
				<Card>
					<CardHeader>
						<div className="flex items-center justify-between">
							<CardTitle>Job Details</CardTitle>
							<StatusBadge status={job.status} type="job" />
						</div>
					</CardHeader>
					<CardContent className="space-y-6">
						<div className="grid grid-cols-2 gap-4">
							<div>
								<p className="text-sm font-medium text-muted-foreground">
									Job ID
								</p>
								<p className="text-sm font-mono mt-1">
									{job.id}
								</p>
							</div>
							<div>
								<p className="text-sm font-medium text-muted-foreground">
									Queue ID
								</p>
								<p className="text-sm font-mono mt-1">
									{job.queueId}
								</p>
							</div>
							<div>
								<p className="text-sm font-medium text-muted-foreground">
									Project ID
								</p>
								<p className="text-sm font-mono mt-1">
									{job.projectId}
								</p>
							</div>
							<div>
								<p className="text-sm font-medium text-muted-foreground">
									Priority
								</p>
								<p className="text-sm mt-1">{job.priority}</p>
							</div>
							<div>
								<p className="text-sm font-medium text-muted-foreground">
									Attempts
								</p>
								<p className="text-sm mt-1">{job.attempts}</p>
							</div>
							<div>
								<p className="text-sm font-medium text-muted-foreground">
									Timeout
								</p>
								<p className="text-sm mt-1">
									{job.timeoutMs
										? `${job.timeoutMs}ms`
										: "None"}
								</p>
							</div>
						</div>

						<Separator />

						<div className="space-y-3">
							<h4 className="text-sm font-semibold">
								Timestamps
							</h4>
							<div className="grid grid-cols-1 gap-3">
								<div>
									<p className="text-sm font-medium text-muted-foreground">
										Created At
									</p>
									<p className="text-sm mt-1">
										{formatDateTime(job.createdAt)}
									</p>
								</div>
								<div>
									<p className="text-sm font-medium text-muted-foreground">
										Scheduled At
									</p>
									<p className="text-sm mt-1">
										{job.scheduledAt
											? formatDateTime(job.scheduledAt)
											: "N/A"}
									</p>
								</div>
								<div>
									<p className="text-sm font-medium text-muted-foreground">
										Started At
									</p>
									<p className="text-sm mt-1">
										{job.startedAt
											? formatDateTime(job.startedAt)
											: "N/A"}
									</p>
								</div>
								<div>
									<p className="text-sm font-medium text-muted-foreground">
										Latency
									</p>
									<p className="text-sm mt-1">{latencyLabel}</p>
								</div>
							</div>
						</div>

						<Separator />

						<div className="space-y-3">
							<h4 className="text-sm font-semibold">Payload</h4>
							<pre className="bg-muted p-3 rounded-md text-xs overflow-auto max-h-64">
								{JSON.stringify(job.payload, null, 2)}
							</pre>
						</div>
					</CardContent>
				</Card>

				<JobEventsTimeline
					events={jobEvents}
					onPageChange={handlePageChange}
					pagination={jobEventsPagination}
				/>
			</DialogContent>
		</Dialog>
	);
};
export default ViewJobDialog;
