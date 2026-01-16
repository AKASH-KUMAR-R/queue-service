import type { JobEvent, JobEventType } from "../types/types";

export const getEventColor = (eventType: JobEventType) => {
	switch (eventType) {
		case "JOB_CREATED":
			return "bg-blue-500";
		case "JOB_ACQUIRED":
			return "bg-indigo-500";
		case "JOB_STARTED":
			return "bg-cyan-500";
		case "JOB_HEARTBEAT":
			return "bg-purple-500";
		case "JOB_COMPLETED":
			return "bg-green-500";
		case "JOB_FAILED":
			return "bg-red-500";
		case "JOB_REQUEUED":
			return "bg-yellow-500";
		case "JOB_EXPIRED":
			return "bg-orange-500";
		default:
			return "bg-gray-500";
	}
};

export const getEventVariant = (eventType: JobEventType) => {
	switch (eventType) {
		case "JOB_COMPLETED":
			return "default";
		case "JOB_FAILED":
		case "JOB_EXPIRED":
			return "destructive";
		case "JOB_REQUEUED":
		case "JOB_HEARTBEAT":
			return "secondary";
		default:
			return "outline";
	}
};

export const getEventLabel = (eventType: JobEventType) => {
	return eventType.replace("JOB_", "").replace("_", " ");
};

export const getEventMessage = (event: JobEvent) => {
	switch (event.eventType) {
		case "JOB_CREATED":
			return "Job created and queued";
		case "JOB_ACQUIRED":
			return `Job acquired by worker ${event.workerId}`;
		case "JOB_STARTED":
			return `Job started execution`;
		case "JOB_HEARTBEAT":
			return "Job heartbeat received";
		case "JOB_COMPLETED":
			return "Job completed successfully";
		case "JOB_FAILED":
			return "Job execution failed";
		case "JOB_REQUEUED":
			return "Job requeued for retry";
		case "JOB_EXPIRED":
			return "Job expired without completion";
		default:
			return event.eventType;
	}
};
