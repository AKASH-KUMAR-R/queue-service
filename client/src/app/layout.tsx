import { Navigate, Route, Routes } from "react-router-dom";

import { AppearanceSettingsPage } from "@pages/AppearanceSettingsPage";
import { JobsPage } from "@pages/JobsPage";
import { MetricsPage } from "@pages/MetricsPage";
import { ProjectSettingsPage } from "@pages/ProjectSettingsPage";
import { ProjectStatisticsPage } from "@pages/ProjectStatisticsPage";
import { QueuesPage } from "@pages/QueuesPage";
import { WorkersPage } from "@pages/WorkersPage";
import { ProjectApiKeysPage } from "@pages/project/ProjectApiKeysPage";

import { useProject } from "./ProjectContext";
import { CommonLayoutWrapper } from "./wrapper/CommonLayoutWrapper";

export function AppLayout() {
	const { currentProject } = useProject();

	return (
		<div className="flex h-screen bg-background">
			{/* <main className="flex-1 overflow-auto"> */}
			<Routes>
				<Route
					path="*"
					element={
						<CommonLayoutWrapper>
							<Routes>
								<Route path="/" element={<QueuesPage />} />

								<Route
									path="/queues"
									element={<QueuesPage />}
								/>
								<Route path="/jobs" element={<JobsPage />} />
								<Route
									path="/jobs/:queueId"
									element={<JobsPage />}
								/>
								<Route
									path="/workers"
									element={<WorkersPage />}
								/>
								<Route
									path="/metrics"
									element={<MetricsPage />}
								/>

								<Route
									path="/project/statistics"
									element={<ProjectStatisticsPage />}
								/>
								<Route
									path="/project/api-keys"
									element={
										<ProjectApiKeysPage
											projectId={currentProject.id}
										/>
									}
								/>
								<Route
									path="/project/settings"
									element={<ProjectSettingsPage />}
								/>

								<Route
									path="/settings/appearance"
									element={<AppearanceSettingsPage />}
								/>

								<Route
									path="/settings"
									element={
										<Navigate
											to="/project/settings"
											replace
										/>
									}
								/>
							</Routes>
						</CommonLayoutWrapper>
					}
				/>
			</Routes>
			{/* </main> */}
		</div>
	);
}
