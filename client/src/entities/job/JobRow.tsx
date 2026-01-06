import { ChevronDown, ChevronRight, Copy, ExternalLink } from 'lucide-react';
import { StatusBadge } from '../StatusBadge';
import { RetryJobButton } from '../../features/jobs/RetryJobButton';
import { CancelJobButton } from '../../features/jobs/CancelJobButton';
import { copyToClipboard } from '../../shared/utils/clipboard';
import type { Job } from './types';

interface JobRowProps {
  job: Job;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

export function JobRow({ job, isExpanded, onToggleExpand }: JobRowProps) {
  const formatTimestamp = (timestamp: string | null) => {
    if (!timestamp) return '—';
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const handleCopy = async (text: string) => {
    const success = await copyToClipboard(text);
    if (!success) {
      // Optionally show a toast or error message
      console.error('Failed to copy to clipboard');
    }
  };

  return (
    <>
      <tr className="hover:bg-neutral-50">
        <td className="px-4 py-3">
          <button
            onClick={onToggleExpand}
            className="text-neutral-400 hover:text-neutral-600"
          >
            {isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
        </td>
        <td className="px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm text-neutral-900">{job.id}</span>
            <button
              onClick={() => handleCopy(job.id)}
              className="text-neutral-400 hover:text-neutral-600"
            >
              <Copy className="w-3 h-3" />
            </button>
          </div>
        </td>
        <td className="px-4 py-3">
          <StatusBadge status={job.status} type="job" />
        </td>
        <td className="px-4 py-3">
          <span className="text-sm text-neutral-700">{job.attempts} / {job.maxAttempts}</span>
        </td>
        <td className="px-4 py-3">
          <span className="text-sm text-neutral-700">{job.priority}</span>
        </td>
        <td className="px-4 py-3">
          <span className="text-xs text-neutral-600">{formatTimestamp(job.scheduledAt)}</span>
        </td>
        <td className="px-4 py-3">
          <span className="text-xs text-neutral-600">{formatTimestamp(job.startedAt)}</span>
        </td>
        <td className="px-4 py-3">
          <div className="flex items-center gap-2">
            {(job.status === 'failed' || job.status === 'timed-out') && (
              <RetryJobButton jobId={job.id} />
            )}
            {(job.status === 'pending' || job.status === 'scheduled' || job.status === 'in-progress') && (
              <CancelJobButton jobId={job.id} />
            )}
            <button
              className="text-neutral-400 hover:text-neutral-600"
              title="View details"
            >
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </td>
      </tr>
      {isExpanded && (
        <tr>
          <td colSpan={8} className="px-4 py-4 bg-neutral-50">
            <div className="space-y-3">
              <div>
                <div className="text-xs font-medium text-neutral-600 mb-2">Payload</div>
                <pre className="font-mono text-xs text-neutral-800 bg-white border border-neutral-200 rounded p-3 overflow-x-auto">
{JSON.stringify(job.payload, null, 2)}
                </pre>
              </div>
              {job.error && (
                <div>
                  <div className="text-xs font-medium text-neutral-600 mb-2">Error</div>
                  <div className="font-mono text-xs text-red-700 bg-red-50 border border-red-200 rounded p-3">
                    {job.error}
                  </div>
                </div>
              )}
              {job.completedAt && (
                <div className="text-xs text-neutral-500">
                  Completed: {formatTimestamp(job.completedAt)}
                </div>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}