import api from "@shared/api";
import { generateQueryParams } from "@shared/api/utils/requestUtils";

import type {
	JobByIdResponse,
	JobEventsByIdResponse,
	JobListResponse,
} from "@entities/job/types/apiTypes";
import type {
	JobEventSearchParams,
	RawJobSearchParams,
} from "@entities/job/types/types";
import {
	toJob,
	toJobEventList,
	toJobList,
} from "@entities/job/utils/transform";

export const fetchJobs = async (
	queueId: string,
	filters: RawJobSearchParams,
): Promise<JobListResponse> => {
	const params = generateQueryParams(filters);

	const response = await api.get(
		`/api/dashboard/queue/${queueId}/jobs?${params.toString()}`,
	);

	return {
		data: { ...response.data, results: toJobList(response.data.results) },
	};
};

export const fetchJobById = async (jobId: string): Promise<JobByIdResponse> => {
	const response = await api.get(`/api/dashboard/job/${jobId}`);

	return {
		data: toJob(response.data.data),
	};
};

export const fetchJobEventsById = async (
	jobId: string,
	filters: JobEventSearchParams,
): Promise<JobEventsByIdResponse> => {
	const params = generateQueryParams(filters);

	const response = await api.get(
		`/api/dashboard/job/${jobId}/events?${params.toString()}`,
	);

	return {
		data: {
			...response.data,
			results: toJobEventList(response.data.results),
		},
	};
};
