import {
	DAY_IN_HOUR,
	HOUR_IN_MINUTES,
	MINUTES_IN_SECONDS,
} from "@shared/lib/time";

export const formatDateTime = (dateString: string): string => {
	const date = new Date(dateString);
	return date.toLocaleString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
		hour: "numeric",
		minute: "2-digit",
		hour12: true,
	});
};

export const formatDateTimeSeperate = (timestamp: string) => {
	const date = new Date(timestamp);
	const timeStr = date.toLocaleTimeString("en-US", {
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
	});
	const dateStr = date.toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
	});
	return { timeStr, dateStr };
};

export const formatDurationMilliseconds = (durationMs: number): string => {
	if (durationMs < 1000) {
		return `${Math.round(durationMs)}ms`;
	}

	const seconds = durationMs / 1000;
	const roundedSeconds = Number.isInteger(seconds)
		? seconds.toString()
		: seconds.toFixed(1);

	if (seconds < MINUTES_IN_SECONDS) {
		return `${roundedSeconds}s`;
	}
	const minutes = seconds / MINUTES_IN_SECONDS;
	const roundedMinutes = Number.isInteger(minutes)
		? minutes.toString()
		: minutes.toFixed(1);

	if (minutes < HOUR_IN_MINUTES) {
		return `${roundedMinutes}m`;
	}

	const hours = minutes / HOUR_IN_MINUTES;
	const roundedHours = Number.isInteger(hours)
		? hours.toString()
		: hours.toFixed(1);

	if (hours < DAY_IN_HOUR) {
		return `${roundedHours}h`;
	}

	const days = hours / DAY_IN_HOUR;
	const roundedDays = Number.isInteger(days)
		? days.toString()
		: days.toFixed(1);

	return `${roundedDays}d`;
};
