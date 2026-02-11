import { generatePath } from "react-router-dom";

import { useAppMatches } from "./useAppMatches";

export const useBreadCrumbs = () => {
	const matches = useAppMatches();
	return matches
		.filter((match) => match.handle?.breadcrumb)
		.map((match) => {
			const breadcrumb = match.handle.breadcrumb;

			return {
				label:
					typeof breadcrumb === "function"
						? breadcrumb(match.params)
						: breadcrumb,
				path: generatePath(match.handle.to || "", match.params),
			};
		});
};
