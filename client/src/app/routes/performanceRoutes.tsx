import type { AppRouteObject } from "@shared/types/routes";

import QueueInsightsPage from "@pages/QueueInsightsPage";

export const PerformanceRoutes: AppRouteObject = {
	path: "/metrics",
	element: <QueueInsightsPage />,
};
