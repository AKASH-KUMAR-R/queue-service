const normalizeStatus = (status: string) =>
	status.trim().toLowerCase().replace(/[_\s]/g, "-");

export const getStatusStyle = (status: string) => {
	const normalized = normalizeStatus(status);

	// Success states
	if (
		normalized === "completed" ||
		normalized === "active" ||
		normalized === "online"
	) {
		return "bg-green-100 text-green-700 border-green-200";
	}

	// In progress states
	if (normalized === "in-progress" || normalized === "processing") {
		return "bg-blue-100 text-blue-700 border-blue-200";
	}

	// Pending states
	if (normalized === "pending" || normalized === "scheduled") {
		return "bg-neutral-100 text-neutral-700 border-neutral-200";
	}

	// Failed states
	if (
		normalized === "failed" ||
		normalized === "dead-letter" ||
		normalized === "timed-out"
	) {
		return "bg-red-100 text-red-700 border-red-200";
	}

	// Paused/disabled states
	if (
		normalized === "paused" ||
		normalized === "disabled" ||
		normalized === "offline"
	) {
		return "bg-orange-100 text-orange-700 border-orange-200";
	}

	return "bg-neutral-100 text-neutral-700 border-neutral-200";
};
