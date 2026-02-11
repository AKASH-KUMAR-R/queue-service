import ViewWorkerJobs from "@features/queues/components/worker/ViewWorkerJobs";

import { JobsPage } from "@pages/JobsPage";
import { QueuesPage } from "@pages/QueuesPage";
import { WorkerStatusPage } from "@pages/WorkerStatusPage";

import type { AppRouteObject } from "../../shared/types/routes";

export type QueueJobsRouteParams = {
	queueId: string;
};

export type WorkerStatusRouteParams = {
	queueId: string;
	workerId: string;
};

export const QueueRoutes: AppRouteObject = {
	path: "/queues",
	handle: {
		breadcrumb: "Queues",
		to: "/queues",
	},
	children: [
		{
			index: true,
			element: <QueuesPage />,
		},
		{
			path: ":queueId",
			children: [
				{
					path: "jobs",
					element: <JobsPage />,
					handle: {
						breadcrumb: (params) => `Jobs of ${params.queueId}`,
						to: `/queues/:queueId/jobs`,
					},
				},
				{
					path: "workers",
					handle: {
						breadcrumb: (params) => `Workers of ${params.queueId}`,
						to: `/queues/:queueId/workers`,
					},
					children: [
						{
							index: true,
							element: <WorkerStatusPage />,
						},
						{
							path: ":workerId",
							element: <ViewWorkerJobs />,
							handle: {
								breadcrumb: (params) =>
									`Worker ${params.workerId}`,
								to: `/queues/:queueId/workers/:workerId`,
							},
						},
					],
				},
			],
		},
	],
};
