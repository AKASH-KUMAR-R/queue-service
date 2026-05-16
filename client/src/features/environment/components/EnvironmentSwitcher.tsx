import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@shared/ui/select";

import type { Environment } from "@entities/environment/types/types";

type EnvironmentSwitcherProps = {
	currentEnvironment: Environment | null;
	environments: Environment[];
	onEnvironmentChange: (env: Environment) => void;
};

const EnvironmentSwitcher = ({
	currentEnvironment,
	environments,
	onEnvironmentChange,
}: EnvironmentSwitcherProps) => {
	const handleEnvironmentChange = (envId: string) => {
		console.log("Selected Environment ID:", envId);
		const env = environments.find((e) => e.id === envId);
		if (env) {
			onEnvironmentChange(env);
		}
	};

	console.log("Current Environment:", currentEnvironment, environments);
	return (
		<div>
			<Select
				value={currentEnvironment?.id || ""}
				onValueChange={handleEnvironmentChange}
			>
				<SelectTrigger>
					<SelectValue>
						{currentEnvironment?.name || "Select Environment"}
					</SelectValue>
				</SelectTrigger>
				<SelectContent>
					{environments.map((env) => (
						<SelectItem key={env.id} value={env.id}>
							{env.name}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	);
};

export default EnvironmentSwitcher;
