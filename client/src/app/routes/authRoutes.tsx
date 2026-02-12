import type { AppRouteObject } from "@shared/types/routes";

import LoginPage from "@features/auth/components/LoginPage";
import SignupPage from "@features/auth/components/SignnupPage";

export const AuthRoutes: AppRouteObject[] = [
	{
		path: "/login",
		element: <LoginPage />,
	},
	{
		path: "/sign-up",
		element: <SignupPage />,
	},
];
