import {
	handleError,
	prettifyFieldErrors,
} from "@/shared/api/utils/handleError";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { createProject } from "../services/projectService";
import { projectKeys } from "./keys";

export type ProjectCreateFormErrorHandler = (
	message: string | null,
	error: Record<string, string> | null,
) => void;

export const useProjectCreate = (onError: ProjectCreateFormErrorHandler) => {
	const client = useQueryClient();

	return useMutation({
		mutationFn: createProject,
		onSuccess() {
			client.invalidateQueries({
				queryKey: projectKeys.lists(),
			});
		},
		onError(errors) {
			onError(
				handleError(errors),
				prettifyFieldErrors(
					errors instanceof AxiosError ? errors.response?.data : null,
				),
			);
		},
	});
};
