import { Route, Routes } from "react-router-dom";

import ViewWorkerJobs from "@features/queues/components/worker/ViewWorkerJobs";

import { WorkerStatusPage } from "@pages/WorkerStatusPage";

const WorkerRoutes = () => {
	return (
		<Routes>
			<Route path="/" element={<WorkerStatusPage />} />
			<Route path="/:workerId" element={<ViewWorkerJobs />} />
		</Routes>
	);
};

export default WorkerRoutes;
