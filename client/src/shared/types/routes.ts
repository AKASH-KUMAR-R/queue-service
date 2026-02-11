import type { IndexRouteObject, NonIndexRouteObject } from "react-router-dom";

export type BredcrumbFn = (params: Record<string, string>) => string;

type AppRouteHandler = {
	breadcrumb: string | BredcrumbFn;
	to?: string;
};

export type AppMatchesReturnType = Array<{
	id: string;
	pathname: string;
	params: Record<string, string>;
	handle: AppRouteHandler;
	data: unknown | undefined;
	loaderData: unknown | undefined;
}>;

export interface IndexAppRouteObject extends Omit<
	IndexRouteObject,
	"handle" | "children"
> {
	handle?: AppRouteHandler;
	children?: never;
}

export interface NonIndexAppRouteObject extends Omit<
	NonIndexRouteObject,
	"handle" | "children"
> {
	handle?: AppRouteHandler;
	children?: AppRouteObject[];
}

export type AppRouteObject = IndexAppRouteObject | NonIndexAppRouteObject;
