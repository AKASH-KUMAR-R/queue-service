import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { MetricCharts } from "@widgets/MetricCharts";
import { MetricSummaryCards } from "@widgets/MetricSummaryCards";
import {
	AlertCircle,
	BarChart2,
	CheckCircle,
	Layers,
	Users,
	XCircle,
} from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@shared/ui/alert";
import { Skeleton } from "@shared/ui/skeleton";

import { useProjectInsightsummary } from "@features/project-insights/data/getSummary";
import { useProjectInsightsTrends } from "@features/project-insights/data/listTrends";

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

type AnalyticsCardProps = {
	label: string;
	value: string;
	icon: React.ReactNode;
};

function AnalyticsCard({ label, value, icon }: AnalyticsCardProps) {
	return (
		<div className="col-span-2 bg-white border border-neutral-200 rounded-lg p-4">
			<div className="flex items-center gap-3 mb-3">
				{icon}
				<div className="text-xs text-neutral-500">{label}</div>
			</div>
			<div className="text-xl font-semibold text-neutral-900 mb-1">
				{value}
			</div>
		</div>
	);
}

export default function ProjectInsightsPage() {
	const [searchQuery, setSearchQuery] = useSearchParams();
	const [timeRange, setTimeRange] = useState<TimeRange>("24hr");
	const projectId = searchQuery.get("projectId") ?? "";
	const autoRefresh = searchQuery.get("autoRefresh") === "true";

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
		data: trendsResponse,
		isLoading: isTrendsLoading,
		isError: isTrendsError,
		error: trendsError,
	} = useProjectInsightsTrends(
		projectId,
		{ from, to },
		autoRefresh,
	);

	const {
		data: summaryResponse,
		isLoading: isSummaryLoading,
		isError: isSummaryError,
		error: summaryError,
	} = useProjectInsightsummary(projectId, autoRefresh);

	const trends = useMemo(
		() => trendsResponse?.data ?? [],
		[trendsResponse?.data],
	);
	const latestSummary = summaryResponse?.data ?? null;

	const totals = useMemo(() => {
		const jobs_enqueued = trends.reduce(
			(total, item) => total + item.jobsEnqueued,
			0,
		);
		const jobs_failed = trends.reduce(
			(total, item) => total + item.jobsFailed,
			0,
		);
		const average_success_rate =
			trends.length > 0
				? trends.reduce((total, item) => total + item.successRate, 0) /
					trends.length
				: 0;
		const average_failure_rate =
			trends.length > 0
				? trends.reduce((total, item) => total + item.failureRate, 0) /
					trends.length
				: 0;

		return {
			jobs_enqueued,
			jobs_failed,
			success_rate_percent: average_success_rate * 100,
			failure_rate_percent: average_failure_rate * 100,
		};
	}, [trends]);

	const throughputData = useMemo(() => {
		return trends.map((item) => ({
			time: item.bucketHour.toLocaleTimeString([], {
				hour: "2-digit",
				minute: "2-digit",
			}),
			processed: item.jobsCompleted,
			failed: item.jobsFailed,
		}));
	}, [trends]);

	const summary = useMemo(() => {
		const rangeMinutes = getHoursByRange(timeRange) * 60;

		return {
			throughputPerMinute:
				rangeMinutes > 0 ? totals.jobs_enqueued / rangeMinutes : 0,
			successRatePercent: totals.success_rate_percent,
			avgLatencyMs: null,
			jobsFailed: totals.jobs_failed,
			failureRatePercent: totals.failure_rate_percent,
			retryRatePercent: 0,
		};
	}, [timeRange, totals]);

	const isLoading = isTrendsLoading || isSummaryLoading;
	const isError = isTrendsError || isSummaryError;
	const error = trendsError ?? summaryError;
	const errorMessage =
		error instanceof Error
			? error.message
			: "Unable to fetch project analytics.";

	return (
		<div className="p-8">
			<div className="mb-6 flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-semibold text-foreground">
						Project Analytics
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
							onChange={(e) =>
								setSearchQuery((prev) => {
									prev.set(
										"autoRefresh",
										e.target.checked.toString(),
									);
									return prev;
								})
							}
							className="w-4 h-4"
						/>
						<label htmlFor="auto-refresh" className="text-foreground">
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
					<AlertTitle>Analytics unavailable</AlertTitle>
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
					</div>
				</>
			) : trends.length === 0 ? (
				<div className="text-sm text-muted-foreground">
					No analytics available for this time range
				</div>
			) : (
				<>
					<div className="grid grid-cols-12 gap-4 mb-6">
						<AnalyticsCard
							label="Total Jobs Enqueued"
							value={totals.jobs_enqueued.toLocaleString()}
							icon={
								<BarChart2 className="w-5 h-5 text-blue-600" />
							}
						/>
						<AnalyticsCard
							label="Success Rate"
							value={`${totals.success_rate_percent.toFixed(2)}%`}
							icon={
								<CheckCircle className="w-5 h-5 text-green-600" />
							}
						/>
						<AnalyticsCard
							label="Failure Rate"
							value={`${totals.failure_rate_percent.toFixed(2)}%`}
							icon={
								<AlertCircle className="w-5 h-5 text-red-600" />
							}
						/>
						<AnalyticsCard
							label="Jobs Failed"
							value={totals.jobs_failed.toLocaleString()}
							icon={<XCircle className="w-5 h-5 text-red-400" />}
						/>
						<AnalyticsCard
							label="Active Workers"
							value={(
								latestSummary?.activeWorkers ?? 0
							).toString()}
							icon={<Users className="w-5 h-5 text-purple-600" />}
						/>
						<AnalyticsCard
							label="Active Queues"
							value={(
								latestSummary?.activeQueues ?? 0
							).toString()}
							icon={
								<Layers className="w-5 h-5 text-orange-600" />
							}
						/>
					</div>
					<MetricSummaryCards summary={summary} />
					<MetricCharts
						throughputData={throughputData}
						latencyData={null}
					/>
				</>
			)}
		</div>
	);
}
