import { useQuery } from "@tanstack/react-query";

import type { EnvironmentSearchParams } from "@entities/environment/types/types";
import { toRawEnvironmentSearchParams } from "@entities/environment/utils/transform";

import { listEnvironment } from "../services/environmentService";
import { environmentKeys } from "./keys";

export const useListEnvironments = (
	projectId: string,
	params: EnvironmentSearchParams,
) => {
	const rawParams = toRawEnvironmentSearchParams(params);

	return useQuery({
		queryKey: environmentKeys.list(projectId),
		queryFn: () => listEnvironment(rawParams),
		enabled: !!projectId,
	});
};
