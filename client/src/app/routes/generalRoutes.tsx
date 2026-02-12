import type { AppRouteObject } from "@shared/types/routes";

import { AppearanceSettingsPage } from "@pages/AppearanceSettingsPage";

export const GeneralRoutes: AppRouteObject = {
	path: "settings",
	children: [
		{
			path: "appearance",
			element: <AppearanceSettingsPage />,
		},
	],
};
