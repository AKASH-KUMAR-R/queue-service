import axios, { type AxiosProxyConfig, type CreateAxiosDefaults } from "axios";

type CustomCreateAxiosDefaults = CreateAxiosDefaults & {
	apiKey: string;
};

const getApiClient = (options: CustomCreateAxiosDefaults) => {
	return axios.create({
		...options,
		headers: {
			"x-api-key": options.apiKey,
		},
	});
};

export default getApiClient;
