import { ProjectSettingsPage } from "@pages/ProjectSettingsPage";
import { ProjectStatisticsPage } from "@pages/ProjectStatisticsPage";
import { ProjectApiKeysPage } from "@pages/project/ProjectApiKeysPage";

import type { AppRouteObject } from "../../shared/types/routes";

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
