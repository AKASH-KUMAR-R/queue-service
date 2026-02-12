import { RouterProvider } from "react-router-dom";

import { router } from "./routes";

export function AppLayout() {
	return (
		<div className=" h-screen overflow-auto">
			{/* <main className="flex-1 overflow-auto"> */}

			<RouterProvider router={router} />
		</div>
	);
}
