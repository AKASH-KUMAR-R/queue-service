import {
	handleError,
	prettifyFieldErrors,
} from "@/shared/api/utils/handleError";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { revoke } from "../services/apiKeyService";
import { apiKeys } from "./keys";

export type RevokeApiKeyFormErrorHandler = (
	message: string | null,
	errors: Record<string, string> | null,
) => void;

export const useRevokeApiKeyForm = (onError: RevokeApiKeyFormErrorHandler) => {
	const client = useQueryClient();

	return useMutation({
		mutationFn: (data: { apiKeyId: string }) => revoke(data.apiKeyId),
		onSuccess({ data: resData }) {
			client.invalidateQueries({
				queryKey: apiKeys.projectKeys(resData.data.projectId),
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
