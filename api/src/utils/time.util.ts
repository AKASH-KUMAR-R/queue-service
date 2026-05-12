const floorToUtcHour = (value: Date): Date => {
	const hourStart = new Date(value);
	hourStart.setUTCMinutes(0, 0, 0);

	return hourStart;
};

const generateUtcHourBuckets = (from: Date, to: Date): Date[] => {
	const buckets: Date[] = [];
	const current = floorToUtcHour(from);

	while (current <= to) {
		buckets.push(new Date(current));
		current.setUTCHours(current.getUTCHours() + 1);
	}

	return buckets;
};

export { floorToUtcHour, generateUtcHourBuckets };
