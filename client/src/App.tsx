import { BrowserRouter } from "react-router-dom";

import { ProjectProvider } from "@app/ProjectContext";
import { ThemeProvider } from "@app/ThemeProvider";
import { AppLayout } from "@app/layout";
import { QueryClientProvider } from "@tanstack/react-query";

import { queryClient } from "./config/reactQuery";
import AuthProvider from "./features/auth/context/AuthContext";
import { Toaster } from "./shared/ui/sonner";

export default function App() {
	return (
		<BrowserRouter>
			<ThemeProvider>
				<Toaster />
				<QueryClientProvider client={queryClient}>
					<AuthProvider>
						<ProjectProvider>
							<AppLayout />
						</ProjectProvider>
					</AuthProvider>
				</QueryClientProvider>
			</ThemeProvider>
		</BrowserRouter>
	);
}
