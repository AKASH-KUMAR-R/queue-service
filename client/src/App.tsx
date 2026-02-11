import { ProjectProvider } from "@app/ProjectContext";
import { ThemeProvider } from "@app/ThemeProvider";
import { AppLayout } from "@app/layout";
import { QueryClientProvider } from "@tanstack/react-query";

import { Toaster } from "@shared/ui/sonner";

import AuthProvider from "@features/auth/context/AuthContext";

import { queryClient } from "./config/reactQuery";

export default function App() {
	return (
		// <BrowserRouter>
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
		// </BrowserRouter>
	);
}
