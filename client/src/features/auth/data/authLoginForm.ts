import {
	handleError,
	prettifyFieldErrors,
} from "@/shared/api/utils/handleError";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

import authService from "../services/authService";
import { authKeys } from "./keys";

export type AuthLoginFormErrorHandler = (
	message: string | null,
	errors: Record<string, string> | null,
) => void;

export const useAuthLoginForm = (onError: AuthLoginFormErrorHandler) => {
	const client = useQueryClient();

	return useMutation({
		mutationFn: authService.login,
		onSuccess: () => {
			client.invalidateQueries({ queryKey: authKeys.login });
		},
		onError: (error) => {
			onError(
				handleError(error),
				prettifyFieldErrors(
					error instanceof AxiosError ? error.response?.data : null,
				),
			);
		},
	});
};
