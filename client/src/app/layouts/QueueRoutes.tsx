import { Route, Routes } from "react-router-dom";

import { JobsPage } from "@pages/JobsPage";
import { QueuesPage } from "@pages/QueuesPage";
import { WorkersPage } from "@pages/WorkersPage";

const QueueRoutes = () => {
	return (
		<Routes>
			<Route path="/" element={<QueuesPage />} />
			{/* <Route path="/jobs" element={<JobsPage />} /> */}
			<Route path="/:queueId/jobs" element={<JobsPage />} />
			<Route path="/:queueId/workers" element={<WorkersPage />} />
		</Routes>
	);
};

export default QueueRoutes;
