import { BrowserRouter } from "react-router-dom";

import { ProjectProvider } from "@app/ProjectContext";
import { ThemeProvider } from "@app/ThemeProvider";
import { AppLayout } from "@app/layout";

import AuthProvider from "./features/auth/context/AuthContext";
import { Toaster } from "./shared/ui/sonner";

export default function App() {
	return (
		<BrowserRouter>
			<ThemeProvider>
				<Toaster />
				<AuthProvider>
					<ProjectProvider>
						<AppLayout />
					</ProjectProvider>
				</AuthProvider>
			</ThemeProvider>
		</BrowserRouter>
	);
}
