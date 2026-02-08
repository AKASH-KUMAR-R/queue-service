import { MINUTES_IN_MILLISECOND } from "@shared/lib/time";

export type WorkerStatusMapType = "online" | "idle" | "offline";
type WorkerStatusVariant = "default" | "secondary" | "destructive";

export const WorkerStatusMap: Record<WorkerStatusMapType, WorkerStatusVariant> =
	{
		online: "default",
		idle: "secondary",
		offline: "destructive",
	};

//TODO: Adjust threshold based on server configuration
export const WORKER_ONLINE_THRESHOLD = MINUTES_IN_MILLISECOND; // 1 minute
export const WORKER_IDLE_THRESHOLD = 5 * MINUTES_IN_MILLISECOND;
