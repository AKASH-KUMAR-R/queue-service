import type { AppRouteObject } from "@shared/types/routes";

import ProjectInsightsPage from "@pages/ProjectInsightsPage";
import { ProjectSettingsPage } from "@pages/ProjectSettingsPage";
import { ProjectApiKeysPage } from "@pages/project/ProjectApiKeysPage";

export const ProjectRoutes: AppRouteObject = {
	path: "/project/*",
	children: [
		{
			path: "statistics",
			element: <ProjectInsightsPage />,
		},
		{
			path: "api-keys",
			element: <ProjectApiKeysPage />,
		},
		{
			path: "settings",
			element: <ProjectSettingsPage />,
		},
	],
};
