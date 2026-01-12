import { useProject } from "../ProjectContext";

type ProjectExistenceWrapperProps = {
	children: React.ReactNode;
};

const ProjectExistenceWrapper: React.FC<ProjectExistenceWrapperProps> = ({
	children,
}) => {
	const { currentProject } = useProject();

	if (!currentProject) {
		return (
			<div className="flex items-center justify-center h-full">
				<p className="text-lg text-muted-foreground">
					No project selected. Please create or select a project to
					continue.
				</p>
			</div>
		);
	}

	return children;
};

export default ProjectExistenceWrapper;
