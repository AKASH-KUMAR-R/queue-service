import type { AppRouteObject } from "@shared/types/routes";

import { EnvironmentsPage } from "@pages/EnvironmentsPage";

export const EnvironmentRoutes: AppRouteObject = {
	path: "/environments",
	handle: {
		breadcrumb: "Environments",
		to: "/environments",
	},
	children: [
		{
			index: true,
			element: <EnvironmentsPage />,
		},
	],
};
