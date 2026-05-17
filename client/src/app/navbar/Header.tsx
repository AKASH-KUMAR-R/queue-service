import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

import { SidebarTrigger, useSidebar } from "@shared/ui/sidebar";
import { getCleanUrl } from "@shared/utils/baseUtils";

import type { Environment } from "@entities/environment/types/types";

import EnvironmentSwitcher from "@features/environment/components/EnvironmentSwitcher";
import { useEnvironmentContext } from "@features/environment/context/EnvironmentContext";

import { findNavItemByPath } from "./NavBarConfig";

function Header() {
	const { isMobile } = useSidebar();
	const location = useLocation();
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();

	const pathname = location.pathname;

	const currentNavItem = findNavItemByPath("/" + getCleanUrl(pathname));

	const { currentEnvironment, setCurrentEnvironment, environments } =
		useEnvironmentContext();

	const handleEnvironmentChange = (environment: Environment) => {
		const selectedEnvironment = environments.find(
			(env) => env.id === environment.id,
		);
		if (selectedEnvironment) {
			setCurrentEnvironment(selectedEnvironment);
		}

		const newSearchParams = new URLSearchParams(searchParams);
		newSearchParams.set("environmentId", environment.id);
		navigate({
			pathname: location.pathname,
			search: newSearchParams.toString(),
		});
	};

	return (
		<div className="z-40 py-3 h-16 w-full flex items-center shadow-md p-1 border ">
			{isMobile && <SidebarTrigger />}
			<header className="  w-full flex items-center justify-between">
				<div className=" ml-10 flex items-center text-xl sm:text-2xl font-semibold text-foreground">
					<span>{currentNavItem?.label}</span>
				</div>
				<EnvironmentSwitcher
					currentEnvironment={currentEnvironment}
					environments={environments}
					onEnvironmentChange={handleEnvironmentChange}
				/>
			</header>
		</div>
	);
}

export default Header;
