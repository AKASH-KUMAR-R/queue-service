import { type MouseEvent, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import {
	CreateProjectDialog,
	type CreateProjectFormData,
} from "@/features/projects/CreateProjectDialog";
import { ProjectSwitcher } from "@/features/projects/ProjectSwitcher";
// import { logout } from "@features/users";
import { LogOut } from "lucide-react";

import { useMultiLoading } from "@shared/hooks/useMultiLoading";
import { Button } from "@shared/ui/button";
// import devi from "../../../assets/devihome.png";
import { Sidebar, SidebarContent, useSidebar } from "@shared/ui/sidebar";
import { getCleanUrl } from "@shared/utils/baseUtils";

import { useProject } from "../ProjectContext";
import { getExpandedStateForRoute, navGroups } from "./NavBarConfig";
import NavGroup from "./NavGroup";

// import { useAuth } from "@features/auth";
// import { logout } from "@features/auth/services/authServiceApi";

const LOADING_STATES = {
	logout: "logout",
};

const SideNavbar = () => {
	const location = useLocation();
	const navigate = useNavigate();
	// const { user, clear } = useAuth();
	// const { festivals, fetchFestivals } = useFestival();

	const { startLoading, stopLoading, isLoading } = useMultiLoading();
	const { isMobile, setOpenMobile } = useSidebar();

	const pathName = "/" + getCleanUrl(location.pathname);

	const handleLogout = async () => {
		try {
			startLoading(LOADING_STATES.logout);
			// await logout(); // call backend API
			// clear(); // clear user context
			localStorage.clear(); // clear any local storage
			navigate("/");
		} catch (err) {
			console.error("Logout failed", err);
			// Optionally show toast notification
		} finally {
			stopLoading(LOADING_STATES.logout);
		}
	};

	const handleNavBarItemClick = (event: MouseEvent<HTMLButtonElement>) => {
		const link = event.currentTarget.dataset.link;
		navigate(link || "/");
		setOpenMobile(false);
	};

	// useEffect(() => {
	// 	const filters = {
	// 		status: true,
	// 		limit: 50,
	// 	};

	// 	if (
	// 		hasGroup(user.groups, Groups.counter) ||
	// 		hasGroup(user.groups, Groups.administrator) ||
	// 		hasGroup(user.groups, Groups.officeBearers)
	// 	) {
	// 		filters.counter_active = true;
	// 	} else {
	// 		filters.public_active = true;
	// 	}

	// 	fetchFestivals(filters);
	// }, []);

	const { currentProject, projects, setCurrentProject, addProject } =
		useProject();
	const [showCreateDialog, setShowCreateDialog] = useState(false);

	// Initialize expanded state with auto-expansion for current route
	const [expandedGroups, setExpandedGroups] = useState(() =>
		getExpandedStateForRoute(location.pathname),
	);

	const toggleGroup = (groupId: string) => {
		setExpandedGroups((prev) => ({
			...prev,
			[groupId]: !prev[groupId],
		}));
	};

	const handleCreateProject = (formData: CreateProjectFormData) => {
		const newProject = {
			id: `proj_${Math.random().toString(36).substr(2, 9)}`,
			name: formData.name,
			environment: formData.environment,
			region: formData.region,
			organization: currentProject.organization,
			createdAt: new Date().toISOString(),
		};
		addProject(newProject);
	};

	return (
		<Sidebar className=" z-50 w-64 border-r shadow-sm h-screen">
			<SidebarContent className="p-0">
				<ProjectSwitcher
					currentProject={currentProject}
					projects={projects}
					onProjectChange={setCurrentProject}
					onCreateProject={() => setShowCreateDialog(true)}
				/>
				<nav className="flex-1 p-4 overflow-y-auto">
					{navGroups.map((group) => (
						<NavGroup
							key={group.id}
							group={group}
							isExpanded={expandedGroups[group.id] ?? true}
							onToggle={() => toggleGroup(group.id)}
							handleNavBarItemClick={handleNavBarItemClick}
						/>
					))}
				</nav>

				<div className="p-4 border-t border-gray-200">
					<Button
						variant="ghost"
						onClick={handleLogout}
						className="w-full justify-start text-gray-700 hover:bg-red-50 hover:text-red-600"
						disabled={isLoading(LOADING_STATES.logout)}
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
				organization={currentProject.organization}
			/>
		</Sidebar>
	);
};

export default SideNavbar;
