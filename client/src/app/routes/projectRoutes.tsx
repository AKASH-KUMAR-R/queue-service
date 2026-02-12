import type { AppRouteObject } from "@shared/types/routes";

import { ProjectSettingsPage } from "@pages/ProjectSettingsPage";
import { ProjectStatisticsPage } from "@pages/ProjectStatisticsPage";
import { ProjectApiKeysPage } from "@pages/project/ProjectApiKeysPage";

export const ProjectRoutes: AppRouteObject = {
	path: "/project/*",
	children: [
		{
			path: "statistics",
			element: <ProjectStatisticsPage />,
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
