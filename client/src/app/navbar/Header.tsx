import { useLocation } from "react-router-dom";

import { SidebarTrigger, useSidebar } from "@shared/ui/sidebar";
import { getCleanUrl } from "@shared/utils/baseUtils";

import EnvironmentSwitcher from "@features/environment/components/EnvironmentSwitcher";
import { useEnvironmentContext } from "@features/environment/context/EnvironmentContext";

import { findNavItemByPath } from "./NavBarConfig";

function Header() {
	const { isMobile } = useSidebar();
	const location = useLocation();

	const pathname = location.pathname;

	const currentNavItem = findNavItemByPath("/" + getCleanUrl(pathname));

	const { currentEnvironment, setCurrentEnvironment, environments } =
		useEnvironmentContext();
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
					onEnvironmentChange={setCurrentEnvironment}
				/>
			</header>
		</div>
	);
}

export default Header;
