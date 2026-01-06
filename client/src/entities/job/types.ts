export type JobStatus = 'completed' | 'in-progress' | 'pending' | 'failed' | 'timed-out' | 'scheduled';

export interface Job {
  id: string;
  status: JobStatus;
  attempts: number;
  maxAttempts: number;
  priority: number;
  scheduledAt: string;
  startedAt: string | null;
  completedAt: string | null;
  payload: Record<string, unknown>;
  error?: string;
}
