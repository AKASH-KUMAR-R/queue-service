import { useEffect } from "react";
import { Outlet, useSearchParams } from "react-router-dom";

import { useEnvironmentContext } from "@features/environment/context/EnvironmentContext";
import { useListEnvironments } from "@features/environment/data/listEnvironents";

const EnvironmentExistanceWrapper = () => {
	const [searchParams, setSearchParams] = useSearchParams();

	const { setCurrentEnvironment, setEnvironments } = useEnvironmentContext();

	const {
		data: environments,
		isLoading: isEnvironmentsLoading,
		isError: isEnvironmentsError,
		error: environmentsError,
	} = useListEnvironments(searchParams.get("projectId") || "", {});

	useEffect(() => {
		if (isEnvironmentsLoading) return;

		if (isEnvironmentsError) {
			console.error("Error fetching environments:", environmentsError);
			return;
		}

		if (environments && environments.data.results.length > 0) {
			const defaultEnvironment =
				environments.data.results.find((env) => env.isDefault) ||
				environments.data.results[0];

			setCurrentEnvironment(defaultEnvironment);
			setEnvironments(environments.data.results);
			setSearchParams((prev) => {
				if (prev.get("environmentId")) return prev;
				prev.set("environmentId", defaultEnvironment.id);
				return prev;
			});
		} else {
			setCurrentEnvironment(null);
			setEnvironments([]);
		}
	}, [
		environments,
		isEnvironmentsLoading,
		isEnvironmentsError,
		environmentsError,
	]);

	return <Outlet />;
};

export default EnvironmentExistanceWrapper;
