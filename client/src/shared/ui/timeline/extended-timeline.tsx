import type React from "react";

import { TimelineIndicator } from "../timeline";

export const TimelinePingAndPulseIndicator: React.FC<
	React.HTMLAttributes<HTMLDivElement>
> = ({ className, children, ...props }) => {
	return (
		<TimelineIndicator
			className={` bg-transparent ${className}`}
			{...props}
		>
			<div className=" relative flex justify-center items-center w-full h-full rounded-full">
				<div className=" absolute inset-0 w-full h-full rounded-full bg-green-600 animate-ping" />
				<div className=" absolute inset-0 w-full h-full rounded-full bg-green-600 animate-pulse" />
				{children}
			</div>
		</TimelineIndicator>
	);
};
