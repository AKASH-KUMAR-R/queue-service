import { useLocation } from "react-router-dom";

import { SidebarTrigger, useSidebar } from "@shared/ui/sidebar";
import { getCleanUrl } from "@shared/utils/baseUtils";

import { findNavItemByPath } from "./NavBarConfig";

function Header() {
	const { isMobile } = useSidebar();
	const location = useLocation();

	const pathname = location.pathname;

	const currentNavItem = findNavItemByPath("/" + getCleanUrl(pathname));

	return (
		<div className="z-40 py-3 h-16 w-full flex items-center shadow-md p-1 border ">
			{isMobile && <SidebarTrigger />}
			<header className="  w-full flex items-center justify-between">
				<div className=" ml-10 flex items-center text-xl sm:text-2xl font-semibold text-foreground">
					<span>{currentNavItem?.label}</span>
				</div>
			</header>
		</div>
	);
}

export default Header;
