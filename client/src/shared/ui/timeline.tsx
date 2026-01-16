// Custom timeline component following shadcn design system conventions
import * as React from "react";

import { cn } from "@shared/lib/utils";

export function Timeline({
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>) {
	return (
		<div
			className={cn("relative flex flex-col gap-6", className)}
			{...props}
		/>
	);
}

export function TimelineItem({
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>) {
	return <div className={cn("relative flex gap-4 ", className)} {...props} />;
}

export function TimelineIndicator({
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>) {
	return (
		<div className="relative flex flex-col items-center">
			<div
				className={cn(
					" z-10  h-3 w-3 rounded-full flex justify-center items-center bg-primary",
					className,
				)}
				{...props}
			/>
			<div className=" z-0 flex-1 border" />
		</div>
	);
}

export function TimelineHeader({
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>) {
	return (
		<div className={cn("font-medium leading-none", className)} {...props} />
	);
}

export function TimelineContent({
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>) {
	return (
		<div
			className={cn("text-sm text-muted-foreground", className)}
			{...props}
		/>
	);
}
