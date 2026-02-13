import { useEffect } from "react";
import { Outlet, useSearchParams } from "react-router-dom";

import { useProject } from "@app/ProjectContext";

//INFO: This component is responsible for attaching the current project context to the URL as a query parameter. It listens for changes in the current project and updates the URL accordingly. If no current project is found, it prompts the user to select or create a project. This ensures that the project context is always reflected in the URL, allowing for better navigation and sharing of specific project views.
export const CurrentProjectAttachWrapper = () => {
	const [, setSearchParams] = useSearchParams();

	const { currentProject } = useProject();

	useEffect(() => {
		if (!currentProject) return;

		setSearchParams((prev) => {
			const newParams = new URLSearchParams(prev);
			newParams.set("projectId", currentProject.id);
			return newParams;
		});
	}, [currentProject, setSearchParams]);

	if (!currentProject) {
		return (
			<div className="flex items-center justify-center">
				<p className="text-lg text-muted-foreground">
					No project selected. Please create or select a project to
					continue.
				</p>
			</div>
		);
	}

	return <Outlet />;
};
