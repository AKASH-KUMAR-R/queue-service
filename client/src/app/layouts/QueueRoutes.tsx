import { Route, Routes } from "react-router-dom";

import { JobsPage } from "@pages/JobsPage";
import { QueuesPage } from "@pages/QueuesPage";
import { WorkerStatusPage } from "@pages/WorkerStatusPage";
import { WorkersPage } from "@pages/WorkersPage";

// TODO: Think about a way to use the queue label instead of ID in the URL, Also, the consisitant project id query params across the app
const QueueRoutes = () => {
	return (
		<Routes>
			<Route path="/" element={<QueuesPage />} />
			{/* <Route path="/jobs" element={<JobsPage />} /> */}
			<Route path="/:queueId/jobs" element={<JobsPage />} />
			<Route path="/:queueId/workers" element={<WorkerStatusPage />} />
		</Routes>
	);
};

export default QueueRoutes;
