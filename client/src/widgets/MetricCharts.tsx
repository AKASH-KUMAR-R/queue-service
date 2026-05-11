import {
	CartesianGrid,
	Legend,
	Line,
	LineChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";

type ThroughputChartData = {
	time: string;
	processed: number;
	failed: number;
};

type LatencyChartData = {
	time: string;
	p50: number | null;
	p95: number | null;
	p99: number | null;
};

type MetricChartsProps = {
	throughputData: ThroughputChartData[];
	latencyData: LatencyChartData[] | null;
};

export function MetricCharts({
	throughputData,
	latencyData,
}: MetricChartsProps) {
	return (
		<div className="space-y-6">
			<div className="bg-white border border-neutral-200 rounded-lg p-6">
				<h3 className="text-base font-medium text-neutral-900 mb-4">
					Job Throughput
				</h3>
				<ResponsiveContainer width="100%" height={300}>
					<LineChart data={throughputData}>
						<CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
						<XAxis
							dataKey="time"
							tick={{ fontSize: 12, fill: "#737373" }}
							stroke="#d4d4d4"
						/>
						<YAxis
							tick={{ fontSize: 12, fill: "#737373" }}
							stroke="#d4d4d4"
						/>
						<Tooltip
							contentStyle={{
								backgroundColor: "#fff",
								border: "1px solid #e5e5e5",
								borderRadius: "6px",
								fontSize: "12px",
							}}
						/>
						<Legend wrapperStyle={{ fontSize: "12px" }} />
						<Line
							type="monotone"
							dataKey="processed"
							stroke="#2563eb"
							strokeWidth={2}
							name="Processed"
							dot={{ r: 4 }}
						/>
						<Line
							type="monotone"
							dataKey="failed"
							stroke="#dc2626"
							strokeWidth={2}
							name="Failed"
							dot={{ r: 4 }}
						/>
					</LineChart>
				</ResponsiveContainer>
			</div>

			{latencyData && (
				<div className="bg-white border border-neutral-200 rounded-lg p-6">
					<h3 className="text-base font-medium text-neutral-900 mb-4">
						Processing Latency (ms)
					</h3>
					<ResponsiveContainer width="100%" height={300}>
						<LineChart data={latencyData}>
							<CartesianGrid
								strokeDasharray="3 3"
								stroke="#e5e5e5"
							/>
							<XAxis
								dataKey="time"
								tick={{ fontSize: 12, fill: "#737373" }}
								stroke="#d4d4d4"
							/>
							<YAxis
								tick={{ fontSize: 12, fill: "#737373" }}
								stroke="#d4d4d4"
							/>
							<Tooltip
								contentStyle={{
									backgroundColor: "#fff",
									border: "1px solid #e5e5e5",
									borderRadius: "6px",
									fontSize: "12px",
								}}
							/>
							<Legend wrapperStyle={{ fontSize: "12px" }} />
							<Line
								type="monotone"
								dataKey="p50"
								stroke="#22c55e"
								strokeWidth={2}
								name="p50"
								dot={{ r: 4 }}
							/>
							<Line
								type="monotone"
								dataKey="p95"
								stroke="#f97316"
								strokeWidth={2}
								name="p95"
								dot={{ r: 4 }}
							/>
							<Line
								type="monotone"
								dataKey="p99"
								stroke="#dc2626"
								strokeWidth={2}
								name="p99"
								dot={{ r: 4 }}
							/>
						</LineChart>
					</ResponsiveContainer>
				</div>
			)}
		</div>
	);
}
