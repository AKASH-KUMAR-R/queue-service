import { useSearchParams } from "react-router-dom";

export const useContextParams = () => {
	const [searchParams] = useSearchParams();

	const projectId = searchParams.get("projectId");
	const environmentId = searchParams.get("environmentId");

	return { projectId, environmentId };
};
