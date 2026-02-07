export type WorkerStatusMapType = "online" | "idle" | "offline";
type WorkerStatusVariant = "default" | "secondary" | "destructive";

export const WorkerStatusMap: Record<WorkerStatusMapType, WorkerStatusVariant> =
	{
		online: "default",
		idle: "secondary",
		offline: "destructive",
	};
