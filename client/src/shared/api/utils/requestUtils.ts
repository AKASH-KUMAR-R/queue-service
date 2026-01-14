const isValidParam = (value: any) => {
	return value !== undefined && value !== "" && value !== null;
};

export const generateQueryParams = (params: Record<string, any>) => {
	const urlParams = new URLSearchParams();

	if (typeof params === "object") {
		Object.entries(params).forEach(([key, value]) => {
			if (isValidParam(value)) {
				urlParams.set(key, value);
			}
		});
	}

	return urlParams;
};
