// Custom timeline component following shadcn design system conventions
import * as React from "react";

import { cn } from "@shared/lib/utils";

export function Timeline({
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>) {
	return (
		<div
			data-slot="timeline"
			className={cn("relative flex flex-col ", className)}
			{...props}
		/>
	);
}

export function TimelineItem({
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>) {
	return (
		<div
			data-slot="timeline-item"
			className={cn(
				'relative flex gap-4 last:**:data-[slot="timeline-line"]:hidden ',
				className,
			)}
			{...props}
		/>
	);
}

export function TimelineIndicator({
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>) {
	return (
		<div
			data-slot="timeline-indicator"
			className="relative flex flex-col items-center"
		>
			<div
				data-slot="timeline-dot"
				className={cn(
					" z-10  h-3 w-3 rounded-full flex justify-center items-center bg-primary",
					className,
				)}
				{...props}
			/>
			<div data-slot="timeline-line" className=" z-0 flex-1 border" />
		</div>
	);
}

export function TimelineHeader({
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>) {
	return (
		<div
			data-slot="timeline-header"
			className={cn("font-medium leading-none", className)}
			{...props}
		/>
	);
}

export function TimelineContent({
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>) {
	return (
		<div
			data-slot="timeline-content"
			className={cn("text-sm text-muted-foreground", className)}
			{...props}
		/>
	);
}
