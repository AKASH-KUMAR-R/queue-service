import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

import { handleError } from "@/shared/api/utils/handleError";
import { Spinner } from "@/shared/ui/spinner";
import { toast } from "sonner";

import { SidebarProvider } from "@shared/ui/sidebar";
import { getCleanUrl } from "@shared/utils/baseUtils";

import { useAuth } from "@features/auth/context/AuthContext";
import { fetchCurrentUser } from "@features/user/services/userService";

import Header from "../navbar/Header";
import { NAVBAR_RESTRICTED_PATHS } from "../navbar/NavBarConfig";
import SideNavbar from "../navbar/SideNavbar";

export const CommonLayoutWrapper = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const { initialize, user } = useAuth();

	const location = useLocation();

	const [isPending, setPending] = useState(true);

	const url = getCleanUrl(location.pathname);

	const isRestricted = NAVBAR_RESTRICTED_PATHS.includes(url);

	const getCurrentUser = async () => {
		try {
			if (user) return;

			setPending(true);
			const { data, error } = await fetchCurrentUser();

			if (!error) {
				initialize(data.user);
			} else {
				toast.info("Your session expired. Please login again");
			}
		} catch (err) {
			toast.error(handleError(err));
		} finally {
			setPending(false);
		}
	};

	useEffect(() => {
		getCurrentUser();
	}, []);

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
