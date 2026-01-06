import { useState } from "react";

import { MetricCharts } from "@widgets/MetricCharts";
import { MetricSummaryCards } from "@widgets/MetricSummaryCards";

type TimeRange = "1h" | "6h" | "24h" | "7d";

export function MetricsPage() {
	const [timeRange, setTimeRange] = useState<TimeRange>("24h");
	const [autoRefresh, setAutoRefresh] = useState(true);

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
						{(["1h", "6h", "24h", "7d"] as TimeRange[]).map(
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

			<MetricSummaryCards />
			<MetricCharts />
		</div>
	);
}
