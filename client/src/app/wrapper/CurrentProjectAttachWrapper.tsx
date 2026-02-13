import { useEffect } from "react";
import { Outlet, useSearchParams } from "react-router-dom";

import { useProject } from "@app/ProjectContext";

export const CurrentProjectAttachWrapper = () => {
	const [_searchParams, setSearchParams] = useSearchParams();

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
