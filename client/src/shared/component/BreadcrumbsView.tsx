import React from "react";

import { ContextLink } from "@app/component/ContextLink";

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
									<ContextLink to={crumb.path}>
										{crumb.label}
									</ContextLink>
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
