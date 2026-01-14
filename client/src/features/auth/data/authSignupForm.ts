import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

import {
	handleError,
	prettifyFieldErrors,
} from "@shared/api/utils/handleError";

import authService from "../services/authService";

export type AuthSignupFormErrorHandler = (
	message: string | null,
	error: Record<string, string> | null,
) => void;

export const useAuthSignup = (onError: AuthSignupFormErrorHandler) => {
	const client = useQueryClient();

	return useMutation({
		mutationFn: authService.signup,
		onSuccess() {
			client.clear();
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
