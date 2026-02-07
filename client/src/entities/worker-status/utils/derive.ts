import type { WorkerStatusMapType } from "../lib/constants";

//TODO: need to define the threshold
export const getWorkerStatus = (lastSeen: string): WorkerStatusMapType => {
	const diff = Date.now() - new Date(lastSeen).getTime();

	if (diff < 60_000) return "online";
	if (diff < 5 * 60_000) return "idle";
	return "offline";
};
