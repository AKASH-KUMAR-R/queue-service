import axios, { type CreateAxiosDefaults } from "axios";

type CustomCreateAxiosDefaults = CreateAxiosDefaults & {
    apiKey: string;
    workerId: string;
};

const getApiClient = (options: CustomCreateAxiosDefaults) => {
    return axios.create({
        ...options,
        headers: {
            "x-api-key": options.apiKey,
            "x-worker-id": options.workerId,
        },
    });
};

export default getApiClient;
