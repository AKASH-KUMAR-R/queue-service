import type { PaginatedResult } from "@shared/types/utils";

import type { Job } from "./types";

export type JobListResponse = {
	data: PaginatedResult<Job>;
};
