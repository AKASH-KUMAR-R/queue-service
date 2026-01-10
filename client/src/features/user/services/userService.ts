import type { User } from "@/entities/user/types/user";
import api from "@/shared/api";

export type FetchCurrentUserResponse = {
	data: {
		user: User;
	};
	error: null | string;
};
export const fetchCurrentUser = async (): Promise<FetchCurrentUserResponse> => {
	const response = await api.get("/api/dashboard/user/me");

	return { data: response.data, error: null };
};
