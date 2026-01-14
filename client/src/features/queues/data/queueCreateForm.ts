import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

import {
	handleError,
	prettifyFieldErrors,
} from "@shared/api/utils/handleError";

import { create } from "../services/queueService";
import { queueKeys } from "./keys";

export type QueueCreateFormErrorHandler = (
	message: string | null,
	error: Record<string, string> | null,
) => void;

export const useQueueCreate = (onError: QueueCreateFormErrorHandler) => {
	const client = useQueryClient();

	return useMutation({
		mutationFn: create,
		onSuccess() {
			client.invalidateQueries({
				queryKey: queueKeys.all,
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
