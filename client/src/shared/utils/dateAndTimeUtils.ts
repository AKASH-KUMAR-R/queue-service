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
