import type { RouteObject } from "react-router-dom";

import LoginPage from "@features/auth/components/LoginPage";
import SignupPage from "@features/auth/components/SignnupPage";

export const AuthRoutes: RouteObject[] = [
	{
		path: "/login",
		element: <LoginPage />,
	},
	{
		path: "/sign-up",
		element: <SignupPage />,
	},
];
