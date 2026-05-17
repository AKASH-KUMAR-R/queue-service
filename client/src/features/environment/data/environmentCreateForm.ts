import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

import {
	handleError,
	prettifyFieldErrors,
} from "@shared/api/utils/handleError";

import { createEnvironment } from "../services/environmentService";
import { environmentKeys } from "./keys";

export type EnvironmentCreateFormErrorHandler = (
	message: string | null,
	error: Record<string, string> | null,
) => void;

export const useEnvironmentCreate = (
	onError: EnvironmentCreateFormErrorHandler,
) => {
	const client = useQueryClient();

	return useMutation({
		mutationFn: createEnvironment,
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
