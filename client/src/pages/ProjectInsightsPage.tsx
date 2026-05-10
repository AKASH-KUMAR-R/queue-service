import { useMemo, useState } from "react";
import {
	AlertCircle,
	BarChart2,
	CheckCircle,
	Layers,
	Users,
	XCircle,
} from "lucide-react";

import { MetricCharts } from "@widgets/MetricCharts";
import { MetricSummaryCards } from "@widgets/MetricSummaryCards";

type TimeRange = "1hr" | "6hr" | "24hr" | "7d";

type MockProjectInsight = {
	bucket_hour: Date;
	jobs_enqueued: number;
	jobs_completed: number;
	jobs_failed: number;
	success_rate: number;
	failure_rate: number;
	active_workers: number;
	active_queues: number;
};

const getBucketCountByRange = (timeRange: TimeRange): number => {
	switch (timeRange) {
		case "1hr":
			return 1;
		case "6hr":
			return 6;
		case "24hr":
			return 24;
		case "7d":
			return 24;
	}
};

const clamp = (value: number, min: number, max: number): number =>
	Math.max(min, Math.min(max, value));

const createMockProjectInsights = (): MockProjectInsight[] => {
	const now = new Date();
	const alignedNow = new Date(now);
	alignedNow.setMinutes(0, 0, 0);

	return Array.from({ length: 24 }, (_, index) => {
		const hourOffset = 23 - index;
		const bucket_hour = new Date(alignedNow);
		bucket_hour.setHours(alignedNow.getHours() - hourOffset);

		const waveLoad =
			78 + Math.round(22 * Math.sin(index / 3) + 16 * Math.cos(index / 5));
		const jobs_completed = clamp(waveLoad, 40, 120);
		const jobs_failed = 2 + ((index * 5 + 1) % 9);
		const buffer = 1 + ((index * 3 + 2) % 5);
		const jobs_enqueued = jobs_completed + jobs_failed + buffer;
		const totalTerminal = jobs_completed + jobs_failed;
		const success_rate =
			totalTerminal === 0 ? 0 : jobs_completed / totalTerminal;
		const failure_rate = totalTerminal === 0 ? 0 : jobs_failed / totalTerminal;
		const active_workers = 3 + ((index * 2 + 1) % 6);
		const active_queues = 2 + ((index * 3 + 1) % 4);

		return {
			bucket_hour,
			jobs_enqueued,
			jobs_completed,
			jobs_failed,
			success_rate,
			failure_rate,
			active_workers,
			active_queues,
		};
	});
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
			<div className="text-xl font-semibold text-neutral-900 mb-1">{value}</div>
		</div>
	);
}

export default function ProjectInsightsPage() {
	const [timeRange, setTimeRange] = useState<TimeRange>("24hr");

	const mockData = useMemo(() => createMockProjectInsights(), []);
	const bucketCount = getBucketCountByRange(timeRange);
	const rangeData = useMemo(
		() => mockData.slice(-bucketCount),
		[mockData, bucketCount],
	);

	const latestBucket = rangeData[rangeData.length - 1] ?? null;

	const totals = useMemo(() => {
		const jobs_enqueued = rangeData.reduce(
			(total, item) => total + item.jobs_enqueued,
			0,
		);
		const jobs_failed = rangeData.reduce(
			(total, item) => total + item.jobs_failed,
			0,
		);
		const average_success_rate =
			rangeData.length > 0
				? rangeData.reduce((total, item) => total + item.success_rate, 0) /
					rangeData.length
				: 0;
		const average_failure_rate =
			rangeData.length > 0
				? rangeData.reduce((total, item) => total + item.failure_rate, 0) /
					rangeData.length
				: 0;

		return {
			jobs_enqueued,
			jobs_failed,
			success_rate_percent: average_success_rate * 100,
			failure_rate_percent: average_failure_rate * 100,
		};
	}, [rangeData]);

	const throughputData = useMemo(() => {
		return rangeData.map((item) => ({
			time: item.bucket_hour.toLocaleTimeString([], {
				hour: "2-digit",
				minute: "2-digit",
			}),
			processed: item.jobs_completed,
			failed: item.jobs_failed,
		}));
	}, [rangeData]);

	const latencyData: {
		time: string;
		p50: number | null;
		p95: number | null;
		p99: number | null;
	}[] = [];

	const summary = useMemo(() => {
		const rangeMinutes = bucketCount * 60;

		return {
			throughputPerMinute:
				rangeMinutes > 0 ? totals.jobs_enqueued / rangeMinutes : 0,
			successRatePercent: totals.success_rate_percent,
			avgLatencyMs: null,
			jobsFailed: totals.jobs_failed,
			failureRatePercent: totals.failure_rate_percent,
			retryRatePercent: 0,
		};
	}, [bucketCount, totals]);

	return (
		<div className="p-8">
			<div className="mb-6 flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-semibold text-foreground">
						Project Analytics
					</h1>
					<p className="text-sm text-muted-foreground mt-1">
						Static preview for project-level insights UI
					</p>
				</div>
				<div className="flex gap-1 bg-muted rounded p-1">
					{(["1hr", "6hr", "24hr", "7d"] as TimeRange[]).map((range) => (
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
					))}
				</div>
			</div>

			<div className="grid grid-cols-12 gap-4 mb-6">
				<AnalyticsCard
					label="Total Jobs Enqueued"
					value={totals.jobs_enqueued.toLocaleString()}
					icon={<BarChart2 className="w-5 h-5 text-blue-600" />}
				/>
				<AnalyticsCard
					label="Success Rate"
					value={`${totals.success_rate_percent.toFixed(2)}%`}
					icon={<CheckCircle className="w-5 h-5 text-green-600" />}
				/>
				<AnalyticsCard
					label="Failure Rate"
					value={`${totals.failure_rate_percent.toFixed(2)}%`}
					icon={<AlertCircle className="w-5 h-5 text-red-600" />}
				/>
				<AnalyticsCard
					label="Jobs Failed"
					value={totals.jobs_failed.toLocaleString()}
					icon={<XCircle className="w-5 h-5 text-red-400" />}
				/>
				<AnalyticsCard
					label="Active Workers"
					value={(latestBucket?.active_workers ?? 0).toString()}
					icon={<Users className="w-5 h-5 text-purple-600" />}
				/>
				<AnalyticsCard
					label="Active Queues"
					value={(latestBucket?.active_queues ?? 0).toString()}
					icon={<Layers className="w-5 h-5 text-orange-600" />}
				/>
			</div>

			<MetricSummaryCards summary={summary} />
			<MetricCharts throughputData={throughputData} latencyData={latencyData} />
		</div>
	);
}

