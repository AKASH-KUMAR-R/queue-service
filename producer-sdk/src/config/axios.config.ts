import axios, { type CreateAxiosDefaults } from "axios";

type CustomCreateAxiosDefaults = CreateAxiosDefaults & {
    apiKey: string;
    producerId: string;
};

const getApiClient = (options: CustomCreateAxiosDefaults) => {
    return axios.create({
        ...options,
        headers: {
            "x-api-key": options.apiKey,
            "x-producer-id": options.producerId,
        },
    });
};

export default getApiClient;
