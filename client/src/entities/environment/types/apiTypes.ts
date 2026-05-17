import type { PaginatedResult } from "@shared/types/utils";

import type { RawEnvironment } from "./types";

export type CreateEnvironmentRequest = {
	project_id: string;
	name: string;
	is_default?: boolean;
};

export type UpdateEnvironmentRequest = {
	name?: string;
	is_default?: boolean;
};

export type EnvironmentResponse = {
	data: RawEnvironment;
};

export type EnvironmentSearchResponse = {
	data: PaginatedResult<RawEnvironment>;
};
