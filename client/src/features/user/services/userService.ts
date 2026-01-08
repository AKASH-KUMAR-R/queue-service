import api from "@/shared/api";
import { handleError } from "@/shared/api/utils/handleError";

export const fetchCurrentUser = async () => {
	try {
		const response = await api.get("/api/dashboard/user/me");

		return { data: response.data, error: null };
	} catch (err) {
		return {
			data: null,
			error: handleError(err),
		};
	}
};
