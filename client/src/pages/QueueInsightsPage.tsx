import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { MetricCharts } from "@widgets/MetricCharts";
import { MetricSummaryCards } from "@widgets/MetricSummaryCards";
import { Alert, AlertDescription, AlertTitle } from "@shared/ui/alert";
import { Skeleton } from "@shared/ui/skeleton";

import { useQueueInsightsList } from "@features/queue-insights/data/listMetrics";

type TimeRange = "1hr" | "6hr" | "24hr" | "7d";

const getHoursByRange = (timeRange: TimeRange): number => {
	switch (timeRange) {
		case "1hr":
			return 1;
		case "6hr":
			return 6;
		case "24hr":
			return 24;
		case "7d":
			return 24 * 7;
	}
};

export default function QueueInsightsPage() {
	const [searchQuery] = useSearchParams();
	const [timeRange, setTimeRange] = useState<TimeRange>("24hr");
	const [autoRefresh, setAutoRefresh] = useState(true);
	const projectId = searchQuery.get("projectId") ?? "";
	const queueId = searchQuery.get("queueId") ?? "";

	const { from, to } = useMemo(() => {
		const now = new Date();
		const fromDate = new Date(now);
		fromDate.setHours(now.getHours() - getHoursByRange(timeRange));

		return {
			from: fromDate,
			to: now,
		};
	}, [timeRange]);

	const {
		data: metrics,
		isLoading,
		isError,
		error,
	} = useQueueInsightsList(projectId, {
		queueId,
		from,
		to,
	});

	const throughputData = useMemo(() => {
		return (metrics ?? []).map((metric) => ({
			time: new Date(metric.bucketHour).toLocaleTimeString([], {
				hour: "2-digit",
				minute: "2-digit",
			}),
			processed: metric.jobsCompleted,
			failed: metric.jobsFailed,
		}));
	}, [metrics]);

	const latencyData = useMemo(() => {
		return (metrics ?? []).map((metric) => ({
			time: new Date(metric.bucketHour).toLocaleTimeString([], {
				hour: "2-digit",
				minute: "2-digit",
			}),
			p50: metric.p50Latency,
			p95: metric.p95Latency,
			p99: metric.p99Latency,
		}));
	}, [metrics]);

	const summary = useMemo(() => {
		const metricsList = metrics ?? [];
		const totalCompleted = metricsList.reduce(
			(total, item) => total + item.jobsCompleted,
			0,
		);
		const totalFailed = metricsList.reduce(
			(total, item) => total + item.jobsFailed,
			0,
		);
		const totalLatencies = metricsList
			.map((item) => item.p50Latency)
			.filter((latency) => latency !== null);
		const averageP50Latency =
			totalLatencies.length > 0
				? totalLatencies.reduce((total, item) => total + item, 0) /
					totalLatencies.length
				: null;
		const averageSuccessRate =
			metricsList.length > 0
				? metricsList.reduce(
						(total, item) => total + item.successRate,
						0,
					) / metricsList.length
				: 0;
		const averageFailureRate =
			metricsList.length > 0
				? metricsList.reduce(
						(total, item) => total + item.failureRate,
						0,
					) / metricsList.length
				: 0;
		const averageRetryRate =
			metricsList.length > 0
				? metricsList.reduce(
						(total, item) => total + item.retryRate,
						0,
					) / metricsList.length
				: 0;
		const rangeMinutes = getHoursByRange(timeRange) * 60;

		return {
			throughputPerMinute:
				rangeMinutes > 0 ? totalCompleted / rangeMinutes : 0,
			successRatePercent: averageSuccessRate * 100,
			avgLatencyMs: averageP50Latency,
			jobsFailed: totalFailed,
			failureRatePercent: averageFailureRate * 100,
			retryRatePercent: averageRetryRate * 100,
		};
	}, [metrics, timeRange]);

	const errorMessage =
		error instanceof Error
			? error.message
			: "Unable to fetch queue metrics.";

	return (
		<div className="p-8">
			<div className="mb-6 flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-semibold text-foreground">
						Metrics
					</h1>
					<p className="text-sm text-muted-foreground mt-1">
						System-wide observability and performance
					</p>
				</div>
				<div className="flex items-center gap-3">
					<div className="flex items-center gap-2 text-sm">
						<input
							type="checkbox"
							id="auto-refresh"
							checked={autoRefresh}
							onChange={(e) => setAutoRefresh(e.target.checked)}
							className="w-4 h-4"
						/>
						<label
							htmlFor="auto-refresh"
							className="text-foreground"
						>
							Auto-refresh
						</label>
					</div>
					<div className="flex gap-1 bg-muted rounded p-1">
						{(["1hr", "6hr", "24hr", "7d"] as TimeRange[]).map(
							(range) => (
								<button
									key={range}
									onClick={() => setTimeRange(range)}
									className={`px-3 py-1 text-sm rounded transition-colors ${
										timeRange === range
											? "bg-card text-foreground shadow-sm"
											: "text-muted-foreground hover:text-foreground"
									}`}
								>
									{range}
								</button>
							),
						)}
					</div>
				</div>
			</div>

			{isError ? (
				<Alert variant="destructive">
					<AlertTitle>Metrics unavailable</AlertTitle>
					<AlertDescription>{errorMessage}</AlertDescription>
				</Alert>
			) : isLoading ? (
				<>
					<div className="grid grid-cols-12 gap-4 mb-6">
						{Array.from({ length: 6 }).map((_, index) => (
							<Skeleton
								key={index}
								className="col-span-2 h-[116px]"
							/>
						))}
					</div>
					<div className="space-y-6">
						<Skeleton className="h-[360px] w-full" />
						<Skeleton className="h-[360px] w-full" />
					</div>
				</>
			) : (metrics ?? []).length === 0 ? (
				<div className="text-sm text-muted-foreground">
					No metrics available for this time range
				</div>
			) : (
				<>
					<MetricSummaryCards summary={summary} />
					<MetricCharts
						throughputData={throughputData}
						latencyData={latencyData}
					/>
				</>
			)}
		</div>
	);
}
