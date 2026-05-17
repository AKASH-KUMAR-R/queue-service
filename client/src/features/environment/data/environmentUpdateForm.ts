import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

import {
	handleError,
	prettifyFieldErrors,
} from "@shared/api/utils/handleError";

import type { UpdateEnvironmentRequest } from "@entities/environment/types/apiTypes";

import { updateEnvironment } from "../services/environmentService";
import { environmentKeys } from "./keys";

export type EnvironmentUpdateFormErrorHandler = (
	message: string | null,
	error: Record<string, string> | null,
) => void;

type UpdateEnvironmentParams = {
	environmentId: string;
	data: UpdateEnvironmentRequest;
};

export const useEnvironmentUpdate = (
	onError: EnvironmentUpdateFormErrorHandler,
) => {
	const client = useQueryClient();

	return useMutation({
		mutationFn: ({ environmentId, data }: UpdateEnvironmentParams) =>
			updateEnvironment(environmentId, data),
		onSuccess() {
			client.invalidateQueries({
				queryKey: environmentKeys.all,
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
