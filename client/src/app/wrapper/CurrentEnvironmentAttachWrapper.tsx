import { useEffect } from "react";
import { Outlet, useSearchParams } from "react-router-dom";

import { useEnvironmentContext } from "@features/environment/context/EnvironmentContext";

export const CurrentEnvironmentAttachWrapper = () => {
	const [searchParams, setSearchParams] = useSearchParams();

	const { currentEnvironment } = useEnvironmentContext();

	useEffect(() => {
		if (!currentEnvironment) return;

		if (currentEnvironment.id === searchParams.get("environmentId")) return;

		setSearchParams((prev) => {
			const newParams = new URLSearchParams(prev);
			newParams.set("environmentId", currentEnvironment.id);
			return newParams;
		});
	}, [currentEnvironment, setSearchParams]);

	if (!currentEnvironment) {
		return (
			<div className="flex items-center justify-center">
				<p className="text-lg text-muted-foreground">
					No environment selected. Please create or select an
					environment to continue.
				</p>
			</div>
		);
	}
	return <Outlet />;
};
