import {
	WORKER_IDLE_THRESHOLD,
	WORKER_ONLINE_THRESHOLD,
	type WorkerStatusMapType,
} from "../lib/constants";

export const getWorkerStatus = (lastSeen: string): WorkerStatusMapType => {
	const diff = Date.now() - new Date(lastSeen).getTime();

	if (diff < WORKER_ONLINE_THRESHOLD) return "online";
	if (diff < WORKER_IDLE_THRESHOLD) return "idle";
	return "offline";
};
