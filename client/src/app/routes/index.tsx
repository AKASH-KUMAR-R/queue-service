import { createBrowserRouter } from "react-router-dom";

import RouteErrorBoundary from "@app/error/ErrorBoundary";
import { CommonLayoutWrapper } from "@app/wrapper/CommonLayoutWrapper";
import ProjectExistenceWrapper from "@app/wrapper/ProjectExistenceWrapper";

import { AuthRoutes } from "./authRoutes";
import { GeneralRoutes } from "./generalRoutes";
import { PerformanceRoutes } from "./performanceRoutes";
import { ProjectRoutes } from "./projectRoutes";
import { QueueRoutes } from "./queueRoutes";

export const router = createBrowserRouter([
	{
		path: "/",
		element: <CommonLayoutWrapper />,
		errorElement: <RouteErrorBoundary />,
		children: [
			{
				path: "/",
				element: <ProjectExistenceWrapper />,
				children: [
					ProjectRoutes,
					QueueRoutes,
					PerformanceRoutes,
					GeneralRoutes,
				],
			},
		],
	},
	...AuthRoutes,
]);
