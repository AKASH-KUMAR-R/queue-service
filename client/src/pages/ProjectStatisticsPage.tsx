import { BarChart3 } from 'lucide-react';

/**
 * Project Statistics Page
 * 
 * Displays project-level analytics and insights including:
 * - Total queues, jobs, workers
 * - Success/failure rates
 * - Performance metrics
 * - Resource usage
 * 
 * Following QaaS Guidelines:
 * - Desktop-first layout
 * - 14px base font
 * - Neutral color palette
 * - Functional, engineering-focused
 */
export function ProjectStatisticsPage() {
  return (
    <div className="p-6">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground">Project Statistics</h1>
        <p className="text-sm text-muted-foreground mt-1">
          View analytics and insights for your project
        </p>
      </div>

      {/* Empty State */}
      <div className="bg-card border border-border rounded-lg p-12 text-center">
        <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-base font-medium text-card-foreground mb-2">
          Statistics Dashboard
        </h2>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          Project-level analytics and metrics will be displayed here. This will include
          queue performance, job success rates, and resource utilization.
        </p>
      </div>
    </div>
  );
}