import { useQuery } from "@tanstack/react-query";

import { MINUTES_IN_MILLISECOND } from "@shared/lib/time";

import { fetchCurrentUser } from "../services/userService";
import { userKeys } from "./keys";

export const useCurrentUser = () => {
	return useQuery({
		queryKey: userKeys.current(),
		queryFn: fetchCurrentUser,
		staleTime: MINUTES_IN_MILLISECOND * 5,
		retry: false,
	});
};
