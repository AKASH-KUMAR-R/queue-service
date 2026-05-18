import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

import { CONTEXT_FREE_PATHS } from "@app/navbar/NavBarConfig";

import { useContextParams } from "./useContextParams";

type NavigateOptions = {
	params: Record<string, string>;
};

export const useContextNavigate = () => {
	const navigate = useNavigate();
	const { projectId, environmentId } = useContextParams();

	return useCallback(
		(path: string, options?: NavigateOptions) => {
			if (
				CONTEXT_FREE_PATHS.some((freePath) => path.startsWith(freePath))
			) {
				navigate(path);
				return;
			}

			const searchParams = new URLSearchParams();
			if (projectId) {
				searchParams.set("projectId", projectId);
			}
			if (environmentId) {
				searchParams.set("environmentId", environmentId);
			}

			Object.entries(options?.params ?? {}).forEach(([key, value]) => {
				searchParams.set(key, value);
			});

			navigate({
				pathname: path,
				search: searchParams.toString(),
			});
		},
		[navigate, projectId, environmentId],
	);
};
