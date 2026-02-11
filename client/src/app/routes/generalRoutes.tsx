import { AppearanceSettingsPage } from "@pages/AppearanceSettingsPage";

import type { AppRouteObject } from "../../shared/types/routes";

export const GeneralRoutes: AppRouteObject = {
	path: "/settings",
	children: [
		{
			path: "appearance",
			element: <AppearanceSettingsPage />,
		},
	],
};
