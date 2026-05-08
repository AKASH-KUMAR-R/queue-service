import {
	Activity,
	AlertCircle,
	CheckCircle,
	Clock,
} from "lucide-react";

interface MetricCardProps {
	label: string;
	value: string;
	icon: React.ReactNode;
}

function MetricCard({ label, value, icon }: MetricCardProps) {
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

type MetricSummary = {
	throughputPerMinute: number;
	successRatePercent: number;
	avgLatencyMs: number | null;
	jobsFailed: number;
	failureRatePercent: number;
	retryRatePercent: number;
};

type MetricSummaryCardsProps = {
	summary: MetricSummary;
};

export function MetricSummaryCards({ summary }: MetricSummaryCardsProps) {

	return (
		<div className="grid grid-cols-12 gap-4 mb-6">
			<MetricCard
				label="Throughput"
				value={`${summary.throughputPerMinute.toFixed(2)}/min`}
				icon={<Activity className="w-5 h-5 text-blue-600" />}
			/>
			<MetricCard
				label="Success Rate"
				value={`${summary.successRatePercent.toFixed(2)}%`}
				icon={<CheckCircle className="w-5 h-5 text-green-600" />}
			/>
			<MetricCard
				label="Avg Latency"
				value={
					summary.avgLatencyMs === null
						? "N/A"
						: `${summary.avgLatencyMs.toFixed(0)}ms`
				}
				icon={<Clock className="w-5 h-5 text-orange-600" />}
			/>
			<MetricCard
				label="Jobs Failed"
				value={summary.jobsFailed.toLocaleString()}
				icon={<Activity className="w-5 h-5 text-blue-600" />}
			/>
			<MetricCard
				label="Failure Rate"
				value={`${summary.failureRatePercent.toFixed(2)}%`}
				icon={<AlertCircle className="w-5 h-5 text-red-600" />}
			/>
			<MetricCard
				label="Retry Rate"
				value={`${summary.retryRatePercent.toFixed(2)}%`}
				icon={<Activity className="w-5 h-5 text-neutral-600" />}
			/>
		</div>
	);
}
