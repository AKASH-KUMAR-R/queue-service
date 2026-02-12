import React from "react";
import { NavLink } from "react-router-dom";

import { useBreadCrumbs } from "@shared/hooks/useBreadCrumbs";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@shared/ui/breadcrumb";

const BreadcrumbsView = () => {
	const crumbs = useBreadCrumbs();

	return (
		<Breadcrumb>
			<BreadcrumbList>
				{crumbs.map((crumb, i) => (
					<React.Fragment key={i}>
						<BreadcrumbItem>
							{i === crumbs.length - 1 ? (
								<BreadcrumbPage>{crumb.label}</BreadcrumbPage>
							) : (
								<BreadcrumbLink asChild>
									<NavLink to={crumb.path}>
										{crumb.label}
									</NavLink>
								</BreadcrumbLink>
							)}
						</BreadcrumbItem>

						{i < crumbs.length - 1 && <BreadcrumbSeparator />}
					</React.Fragment>
				))}
			</BreadcrumbList>
		</Breadcrumb>
	);
};

export default BreadcrumbsView;
