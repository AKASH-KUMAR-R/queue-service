import api from "@shared/api";

import type {
	CreateQueueData,
	CreateQueueResponse,
	SearchQueueResponse,
	UpdateQueueData,
	UpdateQueueResponse,
} from "@entities/queue/types/apiTypes";
import { toQueue, toQueueList } from "@entities/queue/utils/transform";

export const create = async (
	data: CreateQueueData,
): Promise<CreateQueueResponse> => {
	const response = await api.post("/api/dashboard/queue/create", data);
	return { data: toQueue(response.data.data) };
};

export const update = async (
	queueId: string,
	data: UpdateQueueData,
): Promise<UpdateQueueResponse> => {
	const response = await api.put(`/api/dashboard/queue/${queueId}`, data);
	return { data: toQueue(response.data.data) };
};

export const search = async (): Promise<SearchQueueResponse> => {
	const response = await api.get("/api/dashboard/queue/search");

	return {
		data: {
			...response.data.data,
			results: toQueueList(response.data.data.results),
		},
	};
};
