import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";

import { ChevronDown } from "lucide-react";

import { CreateProjectDialog } from "@features/projects/CreateProjectDialog";
import type { CreateProjectFormData } from "@features/projects/CreateProjectDialog";
import { ProjectSwitcher } from "@features/projects/ProjectSwitcher";

import { useProject } from "./ProjectContext";
import {
	type NavGroup as NavGroupType,
	getExpandedStateForRoute,
	navGroups,
} from "./navbar/NavBarConfig";

// ============================================================================
// NavGroup Component
// ============================================================================

interface NavGroupProps {
	group: NavGroupType;
	isExpanded: boolean;
	onToggle: () => void;
}

function NavGroup({ group, isExpanded, onToggle }: NavGroupProps) {
	return (
		<div className="mb-6 first:mb-4">
			{/* Group Header */}
			<div className="flex items-center justify-between px-3 py-2 mb-2">
				<h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
					{group.label}
				</h3>
				{group.collapsible && (
					<button
						onClick={onToggle}
						className="p-1 hover:bg-accent rounded transition-colors"
						aria-label={
							isExpanded
								? `Collapse ${group.label}`
								: `Expand ${group.label}`
						}
						aria-expanded={isExpanded}
					>
						<ChevronDown
							className={`w-4 h-4 text-muted-foreground transition-transform ${
								isExpanded ? "rotate-0" : "-rotate-90"
							}`}
						/>
					</button>
				)}
			</div>

			{/* Group Items */}
			{(!group.collapsible || isExpanded) && (
				<ul className="space-y-1">
					{group.items.length === 0 ? (
						<li className="px-3 py-2 text-xs text-muted-foreground">
							No items
						</li>
					) : (
						group.items.map((item) => (
							<li key={item.path}>
								<NavLink
									to={item.path}
									className={({ isActive }) =>
										`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
											isActive
												? "bg-primary text-primary-foreground"
												: "text-foreground hover:bg-accent"
										}`
									}
									title={item.description}
								>
									{<item.icon className=" w-5 h-5" />}
									<span className="text-sm font-medium">
										{item.label}
									</span>
									{item.badge && (
										<span className="ml-auto text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded">
											{item.badge}
										</span>
									)}
								</NavLink>
							</li>
						))
					)}
				</ul>
			)}
		</div>
	);
}

// ============================================================================
// Sidebar Component
// ============================================================================

export function Sidebar() {
	const { currentProject, projects, setCurrentProject, addProject } =
		useProject();
	const [showCreateDialog, setShowCreateDialog] = useState(false);
	const location = useLocation();

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
		<aside className="w-64 bg-card border-r border-border flex flex-col">
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
					/>
				))}
			</nav>

			<div className="p-4 border-t border-border">
				<div className="text-xs text-muted-foreground">
					<div>
						Project:{" "}
						<span className="font-mono text-foreground">
							{currentProject.id}
						</span>
					</div>
					<div className="mt-1">
						Org:{" "}
						<span className="text-foreground">
							{currentProject.organization}
						</span>
					</div>
				</div>
			</div>

			<CreateProjectDialog
				open={showCreateDialog}
				onClose={() => setShowCreateDialog(false)}
				onSubmit={handleCreateProject}
				organization={currentProject.organization}
			/>
		</aside>
	);
}
