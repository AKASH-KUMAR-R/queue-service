export const getBaseUrl = () => {
	return import.meta.env.VITE_BACKEND_BASE_URL;
};

export const getCleanUrl = (url: string) => {
	if (!url) {
		return "";
	}

	return url
		.trim()
		.split(/[?#]/)[0]
		.replace(/^\/+|\/+$/g, "");
};

export const extractLastValidPart = (url: string) => {
	const clearUrl = getCleanUrl(url);

	const headerName = clearUrl.split("/").pop();

	return headerName;
};
