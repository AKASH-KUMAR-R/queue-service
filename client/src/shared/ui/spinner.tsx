"use client";

import * as React from "react";

import { cn } from "./utils";

type SpinnerProps = React.HTMLAttributes<HTMLDivElement> & {
	size?: "sm" | "default" | "lg";
};

const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
	({ className, size = "default", ...props }, ref) => {
		const sizeClasses = {
			sm: "h-4 w-4 border-2",
			default: "h-6 w-6 border-2",
			lg: "h-8 w-8 border-4",
		};

		return (
			<div
				ref={ref}
				role="status"
				className={cn(
					" border-gray-300 border-t-transparent rounded-full animate-spin",
					sizeClasses[size],
					className,
				)}
				{...props}
			/>
		);
	},
);
Spinner.displayName = "Spinner";

export { Spinner };
