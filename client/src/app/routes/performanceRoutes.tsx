import type { RouteObject } from "react-router-dom";

import { MetricsPage } from "@pages/MetricsPage";

import type { AppRouteObject } from "../../shared/types/routes";

export const PerformanceRoutes: AppRouteObject = {
	path: "/metrics",
	element: <MetricsPage />,
};
