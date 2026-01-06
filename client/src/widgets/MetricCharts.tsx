import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export function MetricCharts() {
  const throughputData = [
    { time: '00:00', processed: 245, failed: 8 },
    { time: '04:00', processed: 312, failed: 5 },
    { time: '08:00', processed: 523, failed: 12 },
    { time: '12:00', processed: 678, failed: 15 },
    { time: '16:00', processed: 589, failed: 9 },
    { time: '20:00', processed: 434, failed: 7 },
  ];

  const latencyData = [
    { time: '00:00', p50: 145, p95: 423, p99: 892 },
    { time: '04:00', p50: 132, p95: 389, p99: 756 },
    { time: '08:00', p50: 167, p95: 512, p99: 1034 },
    { time: '12:00', p50: 198, p95: 634, p99: 1289 },
    { time: '16:00', p50: 156, p95: 478, p99: 945 },
    { time: '20:00', p50: 141, p95: 412, p99: 823 },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white border border-neutral-200 rounded-lg p-6">
        <h3 className="text-base font-medium text-neutral-900 mb-4">Job Throughput</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={throughputData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
            <XAxis 
              dataKey="time" 
              tick={{ fontSize: 12, fill: '#737373' }}
              stroke="#d4d4d4"
            />
            <YAxis 
              tick={{ fontSize: 12, fill: '#737373' }}
              stroke="#d4d4d4"
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#fff', 
                border: '1px solid #e5e5e5',
                borderRadius: '6px',
                fontSize: '12px'
              }}
            />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
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

      <div className="bg-white border border-neutral-200 rounded-lg p-6">
        <h3 className="text-base font-medium text-neutral-900 mb-4">Processing Latency (ms)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={latencyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
            <XAxis 
              dataKey="time" 
              tick={{ fontSize: 12, fill: '#737373' }}
              stroke="#d4d4d4"
            />
            <YAxis 
              tick={{ fontSize: 12, fill: '#737373' }}
              stroke="#d4d4d4"
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#fff', 
                border: '1px solid #e5e5e5',
                borderRadius: '6px',
                fontSize: '12px'
              }}
            />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
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
    </div>
  );
}
