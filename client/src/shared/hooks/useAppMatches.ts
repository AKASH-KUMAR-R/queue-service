import { useMatches } from "react-router-dom";

import type { AppMatchesReturnType } from "@shared/types/routes";

export const useAppMatches = () => {
	return useMatches() as AppMatchesReturnType;
};
