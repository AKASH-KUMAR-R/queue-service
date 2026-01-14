import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

import {
	handleError,
	prettifyFieldErrors,
} from "@shared/api/utils/handleError";

import type { UpdateQueueData } from "@entities/queue/types/apiTypes";

import { update } from "../services/queueService";
import { queueKeys } from "./keys";

export type QueueUpdateFormErrorHandler = (
	message: string | null,
	error: Record<string, string> | null,
) => void;

export const useQueueUpdate = (onError: QueueUpdateFormErrorHandler) => {
	const client = useQueryClient();

	return useMutation({
		mutationFn: ({
			queueId,
			data,
		}: {
			queueId: string;
			data: UpdateQueueData;
		}) => update(queueId, data),
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
