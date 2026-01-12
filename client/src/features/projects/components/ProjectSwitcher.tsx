import { useEffect, useRef, useState } from "react";

import { Check, ChevronDown, Plus } from "lucide-react";

import type { Project } from "@entities/project/types";

type ProjectSwitcherProps = {
	currentProject: Project | null;
	projects: Project[];
	onProjectChange: (project: Project) => void;
	onCreateProject: () => void;
};

export function ProjectSwitcher({
	currentProject,
	projects,
	onProjectChange,
	onCreateProject,
}: ProjectSwitcherProps) {
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		};

		if (isOpen) {
			document.addEventListener("mousedown", handleClickOutside);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [isOpen]);

	return (
		<div className="relative" ref={dropdownRef}>
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="w-full p-6 border-b border-border hover:bg-accent transition-colors text-left"
			>
				<div className="flex items-center justify-between">
					<div className="flex-1 min-w-0">
						<h1 className="text-xl font-semibold text-foreground truncate">
							{currentProject
								? currentProject.label
								: "No Project Selected"}
						</h1>
					</div>
					<ChevronDown
						className={`w-4 h-4 text-muted-foreground transition-transform ${
							isOpen ? "transform rotate-180" : ""
						}`}
					/>
				</div>
			</button>

			{isOpen && (
				<div className="absolute top-full left-0 right-0 bg-card border-b border-border shadow-lg z-50 max-h-96 overflow-y-auto">
					<div className="p-2">
						<div className="text-xs font-medium text-muted-foreground px-3 py-2">
							{currentProject
								? currentProject.label
								: "No Project Selected"}
						</div>

						{projects.map((project) => (
							<button
								key={project.id}
								onClick={() => {
									onProjectChange(project);
									setIsOpen(false);
								}}
								className="w-full flex items-center justify-between px-3 py-2 text-sm text-foreground hover:bg-accent rounded transition-colors"
							>
								<div className="flex-1 min-w-0 text-left">
									<div className="font-medium text-card-foreground truncate">
										{project.label}
									</div>
									<div className={`text-xs mt-0.5`}>
										{project.description}
									</div>
								</div>
								{project.id === currentProject?.id && (
									<Check className="w-4 h-4 text-foreground flex-shrink-0 ml-2" />
								)}
							</button>
						))}
					</div>

					<div className="border-t border-border p-2">
						<button
							onClick={() => {
								onCreateProject();
								setIsOpen(false);
							}}
							className="w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-accent rounded transition-colors"
						>
							<Plus className="w-4 h-4" />
							Create New Project
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
