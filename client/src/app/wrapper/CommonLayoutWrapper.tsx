import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

import { toast } from "sonner";

import { SidebarProvider } from "@shared/ui/sidebar";
import { Spinner } from "@shared/ui/spinner";
import { getCleanUrl } from "@shared/utils/baseUtils";

import { useAuth } from "@features/auth/context/AuthContext";
import { useCurrentUser } from "@features/user/data/currentUser";

import Header from "../navbar/Header";
import { NAVBAR_RESTRICTED_PATHS } from "../navbar/NavBarConfig";
import SideNavbar from "../navbar/SideNavbar";

export const CommonLayoutWrapper = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const { initialize, user } = useAuth();

	const { data, isLoading, isError, isSuccess } = useCurrentUser();

	const location = useLocation();

	// Since we need to wait for the user to be set in the auth context
	// we use a local state to manage the pending state and initialize the state as true. In order to avoid renavigating to the login page before setting the user in the auth context.
	const [isPending, setPending] = useState(true);

	const url = getCleanUrl(location.pathname);

	const isRestricted = NAVBAR_RESTRICTED_PATHS.includes(url);

	useEffect(() => {
		if (isLoading) return;

		if (isSuccess && data) {
			setPending(false);
			initialize(data.data.user);
		}

		if (isError) {
			setPending(false);
			toast.error("Your session expired. Please login again.");
		}
	}, [data, isSuccess, initialize, isLoading, isError]);

	if (isPending) {
		return (
			<div className="flex items-center justify-center w-full h-screen">
				<Spinner size="lg" />
			</div>
		);
	}
	if (!user) {
		return <Navigate to="/" />;
	}

	return (
		<main className=" z-50 w-full flex h-screen bg-background">
			<SidebarProvider>
				{!isRestricted && <SideNavbar />}
				<div className={` relative w-full overflow-hidden`}>
					{!isRestricted && <Header />}
					<div
						className={` px-2 sm:px-6 pt-6 pb-3  w-full  ${
							isRestricted ? "h-full" : " h-[calc(100dvh-4rem)]"
						} overflow-y-auto`}
					>
						{children}
					</div>
				</div>
			</SidebarProvider>
		</main>
	);
};
