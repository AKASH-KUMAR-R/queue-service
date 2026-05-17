import { useEffect } from "react";
import { Outlet, useSearchParams } from "react-router-dom";

import { useLocalStorage } from "@shared/hooks/useLocalStorage";
import { STORAGE_KEYS } from "@shared/lib/storage";

import { useEnvironmentContext } from "@features/environment/context/EnvironmentContext";
import { useListEnvironments } from "@features/environment/data/listEnvironents";

const EnvironmentExistanceWrapper = () => {
	const [searchParams] = useSearchParams();

	const { setCurrentEnvironment, setEnvironments } = useEnvironmentContext();
	const [localStorageEnvironmentValue] = useLocalStorage(
		STORAGE_KEYS.currentEnvironment,
		null,
	);

	const {
		data: environments,
		isLoading: isEnvironmentsLoading,
		isError: isEnvironmentsError,
		error: environmentsError,
		isSuccess: isEnvironmentsSuccess,
	} = useListEnvironments(searchParams.get("projectId") || "", {
		limit: 100,
	});

	useEffect(() => {
		if (isEnvironmentsLoading) return;

		if (isEnvironmentsError) {
			console.error("Error fetching environments:", environmentsError);
			setCurrentEnvironment(null);
			setEnvironments([]);
			return;
		}

		if (isEnvironmentsSuccess) {
			setEnvironments(environments.data.results);

			const defaultEnvironment = localStorageEnvironmentValue
				? environments.data.results.find(
						(env) => env.id === localStorageEnvironmentValue,
					)
				: environments.data.results.find((env) => env.isDefault) ||
					environments.data.results[0];

			setCurrentEnvironment(
				environments.data.results.find(
					(env) => env.id === searchParams.get("environmentId"),
				) ||
					defaultEnvironment ||
					null,
			);
		}
	}, [
		environments,
		searchParams,
		localStorageEnvironmentValue,
		isEnvironmentsLoading,
		isEnvironmentsError,
		environmentsError,
	]);

	if (isEnvironmentsLoading) {
		return (
			<div className="flex items-center justify-center p-4">
				Loading environments...
			</div>
		);
	}

	return <Outlet />;
};

export default EnvironmentExistanceWrapper;
