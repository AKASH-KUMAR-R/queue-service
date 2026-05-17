import type { PaginatedResult } from "@shared/types/utils";

import type { RawEnvironment } from "./types";

export type EnvironmentSearchResponse = {
	data: PaginatedResult<RawEnvironment>;
};
