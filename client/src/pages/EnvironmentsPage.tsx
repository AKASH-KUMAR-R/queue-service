import { useEffect, useState } from "react";

import { useProject } from "@app/ProjectContext";
import { Search } from "lucide-react";

import { EmptyState } from "@shared/ui/EmptyState";
import { Button } from "@shared/ui/button";
import { Input } from "@shared/ui/input";

import type { Environment } from "@entities/environment/types/types";

import { CreateEnvironmentDialog } from "@features/environment/components/CreateEnvironmentDialog";
import { EditEnvironmentDialog } from "@features/environment/components/EditEnvironmentDialog";
import { EnvironmentTable } from "@features/environment/components/EnvironmentTable";
import { useEnvironmentContext } from "@features/environment/context/EnvironmentContext";
import { useListEnvironments } from "@features/environment/data/listEnvironents";

export function EnvironmentsPage() {
	const { currentProject } = useProject();
	const { currentEnvironment, setCurrentEnvironment, setEnvironments } =
		useEnvironmentContext();
	const [searchValue, setSearchValue] = useState("");
	const [debouncedSearch, setDebouncedSearch] = useState("");
	const [page, setPage] = useState(1);
	const [showCreateDialog, setShowCreateDialog] = useState(false);
	const [editingEnvironment, setEditingEnvironment] =
		useState<Environment | null>(null);

	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedSearch(searchValue.trim());
			setPage(1);
		}, 350);

		return () => clearTimeout(timer);
	}, [searchValue]);

	const { data, isLoading } = useListEnvironments(currentProject?.id || "", {
		name: debouncedSearch || undefined,
		page,
		limit: 10,
	});

	const environments = data?.data.results || [];
	const currentPage = data?.data.page || page;
	const totalPages = data?.data.totalPages || 1;

	useEffect(() => {
		if (!data) return;

		setEnvironments(data.data.results);
	}, [data, setEnvironments]);

	const updateEnvironmentContext = (environment: Environment) => {
		setEnvironments(
			environments.map((existingEnvironment) => {
				if (
					environment.isDefault &&
					existingEnvironment.id !== environment.id
				) {
					return { ...existingEnvironment, isDefault: false };
				}

				if (existingEnvironment.id === environment.id) {
					return environment;
				}

				return existingEnvironment;
			}),
		);

		if (
			currentEnvironment?.id === environment.id ||
			environment.isDefault ||
			!currentEnvironment
		) {
			setCurrentEnvironment(environment);
		}
	};

	const handleEnvironmentCreate = (environment: Environment) => {
		setEnvironments([
			...environments.map((existingEnvironment) =>
				environment.isDefault
					? { ...existingEnvironment, isDefault: false }
					: existingEnvironment,
			),
			environment,
		]);

		if (environment.isDefault || !currentEnvironment) {
			setCurrentEnvironment(environment);
		}
	};

	const handleEnvironmentUpdate = (environment: Environment) => {
		updateEnvironmentContext(environment);
		setEditingEnvironment(null);
	};

	if (!currentProject) {
		return (
			<div className="p-6">
				<p className="text-sm text-muted-foreground">
					No project selected. Please select a project to manage
					environments.
				</p>
			</div>
		);
	}

	return (
		<div className="p-8">
			<div className="mb-6 flex items-start justify-between gap-4">
				<div>
					<h1 className="text-2xl font-semibold text-foreground">
						Environments
					</h1>
					<p className="text-sm text-muted-foreground mt-1">
						Manage environments for {currentProject.label}
					</p>
				</div>
				<Button type="button" onClick={() => setShowCreateDialog(true)}>
					Create Environment
				</Button>
			</div>

			<div className="relative mb-6 max-w-md">
				<Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
				<Input
					value={searchValue}
					onChange={(event) => setSearchValue(event.target.value)}
					placeholder="Search environments"
					className="pl-9"
				/>
			</div>

			{environments.length === 0 ? (
				<EmptyState
					title={
						isLoading
							? "Fetching Environments"
							: "No environments found"
					}
					description={
						isLoading
							? "Please wait while we load your environments."
							: searchValue.trim()
								? `No environments match "${searchValue.trim()}".`
								: "No environments available. Create an environment to get started."
					}
					actionLabel={
						!searchValue.trim() && !isLoading
							? "Create Environment"
							: undefined
					}
					onAction={
						!searchValue.trim()
							? () => setShowCreateDialog(true)
							: undefined
					}
				/>
			) : (
				<EnvironmentTable
					data={environments}
					page={currentPage}
					totalPages={totalPages}
					onPageChange={setPage}
					onEdit={setEditingEnvironment}
				/>
			)}

			{showCreateDialog && (
				<CreateEnvironmentDialog
					open={showCreateDialog}
					projectId={currentProject.id}
					onClose={() => setShowCreateDialog(false)}
					onSubmit={handleEnvironmentCreate}
				/>
			)}

			<EditEnvironmentDialog
				open={!!editingEnvironment}
				environment={editingEnvironment}
				onClose={() => setEditingEnvironment(null)}
				onSubmit={handleEnvironmentUpdate}
			/>
		</div>
	);
}
