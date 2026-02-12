import {
	isRouteErrorResponse,
	useNavigate,
	useRouteError,
} from "react-router-dom";

import { Button } from "@shared/ui/button";

const RouteErrorBoundary: React.FC = () => {
	const error = useRouteError();
	const navigate = useNavigate();

	let title = "Something went wrong";
	let description = "An unexpected error occurred.";
	let status: number | null = null;

	if (isRouteErrorResponse(error)) {
		status = error.status;
		title = error.statusText || title;
		description = error.data?.message || description;
	} else if (error instanceof Error) {
		description = error.message;
	}

	return (
		<div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 p-6">
			{status && (
				<h1 className=" text-7xl sm:text-9xl font-bold text-muted-foreground">
					{status}
				</h1>
			)}

			<h2 className="text-xl font-semibold">{title}</h2>

			<p className="text-sm text-muted-foreground max-w-md">
				{description}
			</p>
			<div className="flex gap-3">
				<Button variant="outline" onClick={() => navigate(-1)}>
					Go Back
				</Button>

				<Button onClick={() => window.location.reload()}>Retry</Button>
			</div>
		</div>
	);
};

export default RouteErrorBoundary;
