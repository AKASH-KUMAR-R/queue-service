import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

import {
	handleError,
	prettifyFieldErrors,
} from "@shared/api/utils/handleError";

import { create } from "../services/apiKeyService";
import { apiKeys } from "./keys";

export type CreateApiKeyFormErrorHandler = (
	message: string | null,
	errors: Record<string, string> | null,
) => void;

export const useCreateApiKeyForm = (onError: CreateApiKeyFormErrorHandler) => {
	const client = useQueryClient();

	return useMutation({
		mutationFn: create,
		onSuccess(_, data) {
			client.invalidateQueries({
				queryKey: apiKeys.projectKeys(data.project_id),
			});
		},
		onError(err) {
			onError(
				handleError(err),
				err instanceof AxiosError
					? prettifyFieldErrors(err.response?.data)
					: null,
			);
		},
	});
};
