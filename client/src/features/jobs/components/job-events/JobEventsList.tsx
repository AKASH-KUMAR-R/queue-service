import { ArrowRight } from "lucide-react";

import { Badge } from "@shared/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@shared/ui/card";
import { Paginated } from "@shared/ui/pagination/Paginated";
import {
	Timeline,
	TimelineContent,
	TimelineHeader,
	TimelineIndicator,
	TimelineItem,
} from "@shared/ui/timeline";
import { TimelinePingAndPulseIndicator } from "@shared/ui/timeline/extended-timeline";
import { formatDateTimeSeperate } from "@shared/utils/dateAndTimeUtils";

import type { JobEvent } from "@entities/job/types/types";
import {
	getEventColor,
	getEventLabel,
	getEventMessage,
	getEventVariant,
} from "@entities/job/utils/style";

interface JobEventsTimelineProps {
	events: JobEvent[];
	pagination: {
		page: number;
		limit: number;
		totalPages: number;
	};
	onPageChange: (page: number) => void;
}

export function JobEventsTimeline({
	events,
	pagination,
	onPageChange,
}: JobEventsTimelineProps) {
	return (
		<Card className=" w-full max-w-xl h-full">
			<CardHeader>
				<CardTitle>Event Timeline</CardTitle>
			</CardHeader>
			<CardContent className=" h-full overflow-x-hidden overflow-y-auto">
				{events.length === 0 ? (
					<p className="text-sm text-muted-foreground text-center py-8">
						No events recorded
					</p>
				) : (
					<Timeline>
						{events.map((event, index) => {
							const { timeStr, dateStr } = formatDateTimeSeperate(
								event.createdAt,
							);
							const isFirst =
								index === 0 && pagination.page === 1;

							return (
								<TimelineItem key={event.id}>
									{isFirst ? (
										<TimelinePingAndPulseIndicator
											className={getEventColor(
												event.eventType,
											)}
										/>
									) : (
										<TimelineIndicator
											className={getEventColor(
												event.eventType,
											)}
										/>
									)}
									<div className=" w-full flex-1 pb-8">
										<div className="flex items-center gap-2 mb-1">
											<TimelineHeader>
												{getEventMessage(event)}
											</TimelineHeader>
											<Badge
												variant={getEventVariant(
													event.eventType,
												)}
												className="text-xs"
											>
												{getEventLabel(event.eventType)}
											</Badge>
										</div>
										<TimelineContent>
											<div className="flex items-center gap-2 mb-1">
												<span className="font-medium">
													{timeStr}
												</span>
												<span className="text-xs">
													·
												</span>
												<span>{dateStr}</span>
											</div>
											<div className="flex items-center gap-3 text-xs">
												<span>
													<span className="text-foreground/70">
														Status:
													</span>{" "}
													<span className="font-medium">
														{event.prevStatus}
													</span>
													{<ArrowRight size={12} />}
													<span className="font-medium">
														{event.nextStatus}
													</span>
												</span>
												{event.workerId && (
													<>
														<span>·</span>
														<span>
															<span className="text-foreground/70">
																Worker:
															</span>{" "}
															<span className="font-mono">
																{event.workerId}
															</span>
														</span>
													</>
												)}
											</div>
											{event.metadata &&
												Object.keys(event.metadata)
													.length > 0 && (
													<details className="mt-2 cursor-pointer">
														<summary className="cursor-pointer text-xs hover:text-foreground">
															View metadata
														</summary>
														<pre className="mt-2 bg-muted p-2 rounded text-xs overflow-auto max-h-32">
															{JSON.stringify(
																event.metadata,
																null,
																2,
															)}
														</pre>
													</details>
												)}
										</TimelineContent>
									</div>
								</TimelineItem>
							);
						})}
					</Timeline>
				)}
				<Paginated
					page={pagination.page}
					totalPages={pagination.totalPages}
					onPageChange={onPageChange}
				/>
			</CardContent>
		</Card>
	);
}
