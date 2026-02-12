import type { AppRouteObject } from "@shared/types/routes";

import { MetricsPage } from "@pages/MetricsPage";

export const PerformanceRoutes: AppRouteObject = {
	path: "/metrics",
	element: <MetricsPage />,
};
