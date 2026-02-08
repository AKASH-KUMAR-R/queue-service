import { type MouseEvent, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { LogOut } from "lucide-react";

import { useDialog } from "@shared/hooks/useDialog";
import { Button } from "@shared/ui/button";
import { Sidebar, SidebarContent, useSidebar } from "@shared/ui/sidebar";
import { Spinner } from "@shared/ui/spinner";

import type { Project } from "@entities/project/types";

import { CreateProjectDialog } from "@features/projects/CreateProjectDialog";
import ProjectSwitcherDisplayCurrent from "@features/projects/components/CurrentProject";
import { ProjectSwitcherDialog } from "@features/projects/components/ProjectSwitcher";

import { useProject } from "../ProjectContext";
import { getExpandedStateForRoute, navGroups } from "./NavBarConfig";
import NavGroup from "./NavGroup";

const SideNavbar = () => {
	const location = useLocation();
	const navigate = useNavigate();

	const {
		isOpen: isProjectSwitcherOpen,
		openDialog: openProjectSwitcher,
		closeDialog: closeProjectSwitcher,
	} = useDialog();

	const { setOpenMobile } = useSidebar();

	const handleNavBarItemClick = (event: MouseEvent<HTMLButtonElement>) => {
		const link = event.currentTarget.dataset.link;
		navigate(link || "/");
		setOpenMobile(false);
	};

	const { currentProject, projects, setCurrentProject, isProjectsLoading } =
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

	return (
		<>
			<Sidebar className=" z-50 w-64 border-r shadow-sm h-screen">
				<SidebarContent className="p-0">
					{isProjectsLoading ? (
						<Spinner />
					) : (
						<ProjectSwitcherDisplayCurrent
							project={currentProject}
							onClick={openProjectSwitcher}
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

					<div className=" w-full p-4 border-t border-gray-200">
						<Button variant="ghost" className=" w-full">
							<LogOut className="w-4 h-4 mr-2" />
							Logout
						</Button>
					</div>
				</SidebarContent>

				<ProjectSwitcherDialog
					isOpen={isProjectSwitcherOpen}
					onClose={closeProjectSwitcher}
					currentProject={currentProject}
					projects={projects}
					onProjectChange={setCurrentProject}
					onCreateProject={() => setShowCreateDialog(true)}
				/>

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
