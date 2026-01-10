import { type MouseEvent, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import type { Project } from "@/entities/project/types";
import { CreateProjectDialog } from "@/features/projects/CreateProjectDialog";
import { ProjectSwitcher } from "@/features/projects/components/ProjectSwitcher";
import { useProjectList } from "@/features/projects/data/listProject";
import { Spinner } from "@/shared/ui/spinner";
import { LogOut } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@shared/ui/button";
import { Sidebar, SidebarContent, useSidebar } from "@shared/ui/sidebar";

import { useProject } from "../ProjectContext";
import { getExpandedStateForRoute, navGroups } from "./NavBarConfig";
import NavGroup from "./NavGroup";

const SideNavbar = () => {
	const location = useLocation();
	const navigate = useNavigate();

	const { isMobile, setOpenMobile } = useSidebar();

	const {
		data: projectList,
		isLoading: isProjectListLoading,
		isError: isProjectListError,
		isSuccess: isProjectListSuccess,
	} = useProjectList();

	const handleNavBarItemClick = (event: MouseEvent<HTMLButtonElement>) => {
		const link = event.currentTarget.dataset.link;
		navigate(link || "/");
		setOpenMobile(false);
	};

	const { currentProject, projects, setCurrentProject, initializeProjects } =
		useProject();
	const [showCreateDialog, setShowCreateDialog] = useState(false);

	const [expandedGroups, setExpandedGroups] = useState(() =>
		getExpandedStateForRoute(location.pathname),
	);

	const toggleGroup = (groupId: string) => {
		setExpandedGroups((prev) => ({
			...prev,
			[groupId]: !prev[groupId],
		}));
	};

	const handleCreateProject = (newProject: Project) => {
		setCurrentProject(newProject);
	};

	useEffect(() => {
		if (isProjectListLoading) return;

		if (isProjectListSuccess) {
			console.log("Fetched projects:", projectList.data);
			initializeProjects(projectList.data || []);
		}

		if (isProjectListError) {
			toast.error("Failed to load projects. Please try again.");
		}
	}, [
		projectList,
		isProjectListLoading,
		isProjectListError,
		isProjectListSuccess,
		initializeProjects,
	]);

	return (
		<>
			<Sidebar className=" z-50 w-64 border-r shadow-sm h-screen">
				<SidebarContent className="p-0">
					{isProjectListLoading ? (
						<Spinner />
					) : (
						<ProjectSwitcher
							currentProject={currentProject}
							projects={projects}
							onProjectChange={setCurrentProject}
							onCreateProject={() => setShowCreateDialog(true)}
						/>
					)}
					<div className="flex-1 p-4 overflow-y-auto">
						{navGroups.map((group) => (
							<NavGroup
								key={group.id}
								group={group}
								isExpanded={expandedGroups[group.id] ?? true}
								onToggle={() => toggleGroup(group.id)}
								handleNavBarItemClick={handleNavBarItemClick}
							/>
						))}
					</div>

					<div className="p-4 border-t border-gray-200">
						<Button
							variant="ghost"
							className="w-full justify-start text-gray-700 hover:bg-red-50 hover:text-red-600"
						>
							<LogOut className="w-4 h-4 mr-2" />
							Logout
						</Button>
					</div>
				</SidebarContent>

				<CreateProjectDialog
					open={showCreateDialog}
					onClose={() => setShowCreateDialog(false)}
					onSubmit={handleCreateProject}
				/>
			</Sidebar>
		</>
	);
};

export default SideNavbar;
