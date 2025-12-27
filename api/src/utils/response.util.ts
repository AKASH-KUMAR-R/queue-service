export const enhancedSerialize = (data: any) => {
	const result = JSON.parse(
		JSON.stringify(data, (_, value) =>
			typeof value === "bigint" ? value.toString() : value,
		),
	);

	return result;
};
