import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

import {
	handleError,
	prettifyFieldErrors,
} from "@shared/api/utils/handleError";

import type { UpdateProjectFormData } from "@pages/ProjectSettingsPage";

import { updateProject } from "../services/projectService";
import { projectKeys } from "./keys";

export type ProjectUpdateFormErrorHandler = (
	message: string | null,
	error: Record<string, string> | null,
) => void;

type UpdateProjectParams = {
	projectId: string;
	data: UpdateProjectFormData;
};
export const useProjectUpdate = (onError: ProjectUpdateFormErrorHandler) => {
	const client = useQueryClient();

	return useMutation({
		mutationFn: (data: UpdateProjectParams) =>
			updateProject(data.projectId, data.data),
		onSuccess() {
			client.invalidateQueries({
				queryKey: projectKeys.all,
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
