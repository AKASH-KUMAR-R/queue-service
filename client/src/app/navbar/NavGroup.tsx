import { useLocation } from "react-router-dom";

import {
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/shared/ui/sidebar";
import { getCleanUrl } from "@/shared/utils/baseUtils";
import { ChevronDown } from "lucide-react";

import type { NavGroup as NavGroupType, NavItem } from "./NavBarConfig";

interface NavGroupProps {
	group: NavGroupType;
	isExpanded: boolean;
	onToggle: () => void;
	handleNavBarItemClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const NavGroup = ({
	group,
	isExpanded,
	onToggle,
	handleNavBarItemClick,
}: NavGroupProps) => {
	const location = useLocation();

	const isActive = (item: NavItem) => {
		return item.path === "/" + getCleanUrl(location.pathname);
	};

	return (
		<SidebarGroup key={group.id}>
			<SidebarGroupLabel className="text-[#800000] font-medium text-base flex justify-between">
				{group.label}
				{group.collapsible && (
					<button
						onClick={onToggle}
						className="p-1 hover:bg-accent rounded transition-colors"
						aria-label={
							isExpanded
								? `Collapse ${group.label}`
								: `Expand ${group.label}`
						}
						aria-expanded={isExpanded}
					>
						<ChevronDown
							className={`w-4 h-4 text-muted-foreground transition-transform ${
								isExpanded ? "rotate-0" : "-rotate-90"
							}`}
						/>
					</button>
				)}
			</SidebarGroupLabel>
			<SidebarGroupContent>
				<SidebarMenu>
					{(!group.collapsible || isExpanded) && (
						<SidebarMenuItem className="space-y-1">
							{group.items.length === 0 ? (
								<span className="px-3 py-2 text-xs text-muted-foreground">
									No items
								</span>
							) : (
								group.items.map((item) => (
									<SidebarMenuItem key={item.path}>
										<SidebarMenuButton
											data-link={item.path}
											onClick={handleNavBarItemClick}
											className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
												isActive(item)
													? "bg-primary text-primary-foreground"
													: "text-foreground hover:bg-accent"
											}`}
											title={item.description}
										>
											{<item.icon className=" w-5 h-5" />}
											<span className="text-sm font-medium">
												{item.label}
											</span>
											{item.badge && (
												<span className="ml-auto text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded">
													{item.badge}
												</span>
											)}
										</SidebarMenuButton>
									</SidebarMenuItem>
								))
							)}
						</SidebarMenuItem>
					)}
				</SidebarMenu>
			</SidebarGroupContent>
		</SidebarGroup>
	);
};

export default NavGroup;
