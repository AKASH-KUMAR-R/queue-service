import type { PaginatedResult } from "@shared/types/utils";

import type { Job, JobEvent } from "./types";

export type JobListResponse = {
	data: PaginatedResult<Job>;
};

export type JobByIdResponse = {
	data: Job;
};

export type JobEventsByIdResponse = {
	data: PaginatedResult<JobEvent>;
};
