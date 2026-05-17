import { type ReactNode, createContext, useContext, useState } from "react";

import { useLocalStorage } from "@shared/hooks/useLocalStorage";
import { STORAGE_KEYS } from "@shared/lib/storage";

import type { Environment } from "@entities/environment/types/types";

type EnvironmentContextType = {
	currentEnvironment: Environment | null;
	environments: Environment[];
	setCurrentEnvironment: (environment: Environment | null) => void;
	setEnvironments: (environments: Environment[]) => void;
};

const EnvironmentContext = createContext<EnvironmentContextType | null>(null);

export const EnvironmentProvider = ({ children }: { children: ReactNode }) => {
	const [currentEnvironment, setCurrentEnvironment] =
		useState<Environment | null>(null);
	const [environments, setEnvironments] = useState<Environment[]>([]);
	const [, setLocalStorageEnvironmentValue] = useLocalStorage(
		STORAGE_KEYS.currentEnvironment,
		currentEnvironment?.id || null,
	);

	const handleChangeCurrentEnvironment = (
		environment: Environment | null,
	) => {
		setCurrentEnvironment(environment);
		if (environment) {
			setLocalStorageEnvironmentValue(environment.id);
		} else {
			setLocalStorageEnvironmentValue(null);
		}
	};

	return (
		<EnvironmentContext.Provider
			value={{
				currentEnvironment,
				environments,
				setCurrentEnvironment: handleChangeCurrentEnvironment,
				setEnvironments,
			}}
		>
			{children}
		</EnvironmentContext.Provider>
	);
};

export const useEnvironmentContext = () => {
	const context = useContext(EnvironmentContext);
	if (!context) {
		throw new Error(
			"useEnvironmentContext must be used within an EnvironmentProvider",
		);
	}
	return context;
};
