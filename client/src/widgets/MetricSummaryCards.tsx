import { TrendingUp, TrendingDown, Activity, Clock, AlertCircle, CheckCircle } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string;
  change: number;
  icon: React.ReactNode;
  invertChange?: boolean;
}

function MetricCard({ label, value, change, icon, invertChange = false }: MetricCardProps) {
  const isPositive = invertChange ? change < 0 : change > 0;
  const changeColor = isPositive ? 'text-green-600' : 'text-red-600';
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;

  return (
    <div className="col-span-2 bg-white border border-neutral-200 rounded-lg p-4">
      <div className="flex items-center gap-3 mb-3">
        {icon}
        <div className="text-xs text-neutral-500">{label}</div>
      </div>
      <div className="text-xl font-semibold text-neutral-900 mb-1">{value}</div>
      <div className={`flex items-center gap-1 text-xs ${changeColor}`}>
        <TrendIcon className="w-3 h-3" />
        <span>{Math.abs(change)}%</span>
      </div>
    </div>
  );
}

export function MetricSummaryCards() {
  const currentMetrics = {
    throughput: 523,
    throughputChange: 12.4,
    successRate: 98.2,
    successRateChange: -0.3,
    avgLatency: 167,
    latencyChange: 8.2,
    activeJobs: 847,
    activeJobsChange: 5.1,
    failureRate: 1.8,
    failureRateChange: 0.3,
    retryRate: 4.2,
    retryRateChange: -1.2,
  };

  return (
    <div className="grid grid-cols-12 gap-4 mb-6">
      <MetricCard
        label="Throughput"
        value={`${currentMetrics.throughput}/min`}
        change={currentMetrics.throughputChange}
        icon={<Activity className="w-5 h-5 text-blue-600" />}
      />
      <MetricCard
        label="Success Rate"
        value={`${currentMetrics.successRate}%`}
        change={currentMetrics.successRateChange}
        icon={<CheckCircle className="w-5 h-5 text-green-600" />}
      />
      <MetricCard
        label="Avg Latency"
        value={`${currentMetrics.avgLatency}ms`}
        change={currentMetrics.latencyChange}
        icon={<Clock className="w-5 h-5 text-orange-600" />}
        invertChange
      />
      <MetricCard
        label="Active Jobs"
        value={currentMetrics.activeJobs.toLocaleString()}
        change={currentMetrics.activeJobsChange}
        icon={<Activity className="w-5 h-5 text-blue-600" />}
      />
      <MetricCard
        label="Failure Rate"
        value={`${currentMetrics.failureRate}%`}
        change={currentMetrics.failureRateChange}
        icon={<AlertCircle className="w-5 h-5 text-red-600" />}
        invertChange
      />
      <MetricCard
        label="Retry Rate"
        value={`${currentMetrics.retryRate}%`}
        change={currentMetrics.retryRateChange}
        icon={<Activity className="w-5 h-5 text-neutral-600" />}
      />
    </div>
  );
}
