import api from "@shared/api";

import type { User } from "@entities/user/types/user";
import { toUser } from "@entities/user/utils/transform";

export type FetchCurrentUserResponse = {
	data: {
		user: User;
	};
};
export const fetchCurrentUser = async (): Promise<FetchCurrentUserResponse> => {
	const response = await api.get("/api/dashboard/user/me");

	return {
		data: {
			user: toUser(response.data.user),
		},
	};
};
