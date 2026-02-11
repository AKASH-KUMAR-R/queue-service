import { useMutation, useQueryClient } from "@tanstack/react-query";

import authService from "../services/authService";

export const useAuthLogout = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: authService.logout,
		onSuccess: () => {
			queryClient.clear();
		},
	});
};
