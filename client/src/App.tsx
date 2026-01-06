import { BrowserRouter } from "react-router-dom";

import { ProjectProvider } from "@app/ProjectContext";
import { ThemeProvider } from "@app/ThemeProvider";
import { AppLayout } from "@app/layout";

export default function App() {
	return (
		<BrowserRouter>
			<ThemeProvider>
				<ProjectProvider>
					<AppLayout />
				</ProjectProvider>
			</ThemeProvider>
		</BrowserRouter>
	);
}
