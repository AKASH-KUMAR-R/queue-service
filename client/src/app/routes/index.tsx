import { createBrowserRouter } from "react-router-dom";

import RouteErrorBoundary from "@app/error/ErrorBoundary";
import { CommonLayoutWrapper } from "@app/wrapper/CommonLayoutWrapper";
import { CurrentProjectAttachWrapper } from "@app/wrapper/CurrentProjectAttachWrapper";
import EnvironmentExistanceWrapper from "@app/wrapper/EnvironmentExistanceWrapper";
import ProjectsExistenceWrapper from "@app/wrapper/ProjectsExistenceWrapper";

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
				element: <ProjectsExistenceWrapper />,

				children: [
					{
						element: <EnvironmentExistanceWrapper />,
						children: [
							{
								element: <CurrentProjectAttachWrapper />,
								children: [
									ProjectRoutes,
									QueueRoutes,
									PerformanceRoutes,
								],
							},
							{
								path: "general/*",
								children: [GeneralRoutes],
							},
						],
					},
				],
			},
		],
	},
	...AuthRoutes,
]);
