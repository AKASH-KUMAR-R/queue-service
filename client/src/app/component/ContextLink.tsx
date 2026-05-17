import { useMemo } from "react";
import { Link, type LinkProps } from "react-router-dom";

import { useContextParams } from "@app/hooks/useContextParams";

export const ContextLink = ({ to, children, ...props }: LinkProps) => {
	const { projectId, environmentId } = useContextParams();

	const search = useMemo(() => {
		const params = new URLSearchParams();
		if (projectId) params.set("projectId", projectId);
		if (environmentId) params.set("environmentId", environmentId);
		return params.toString();
	}, [projectId, environmentId]);

	return (
		<Link to={{ pathname: to as string, search }} {...props}>
			{children}
		</Link>
	);
};
