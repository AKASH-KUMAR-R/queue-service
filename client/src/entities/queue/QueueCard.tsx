import { MoreVertical, RefreshCw, AlertCircle } from 'lucide-react';
import { StatusBadge } from '../StatusBadge';
import { PauseQueueButton } from '../../features/queues/PauseQueueButton';
import { ResumeQueueButton } from '../../features/queues/ResumeQueueButton';
import type { Queue } from './types';

interface QueueCardProps {
  queue: Queue;
  onSelectQueue: (queueId: string) => void;
}

export function QueueCard({ queue, onSelectQueue }: QueueCardProps) {
  return (
    <div className="col-span-6 bg-white border border-neutral-200 rounded-lg p-6 hover:border-neutral-300 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-base font-medium text-neutral-900">{queue.name}</h3>
            <StatusBadge status={queue.status} type="queue" />
          </div>
          <p className="text-xs font-mono text-neutral-500">{queue.id}</p>
        </div>
        <button className="text-neutral-400 hover:text-neutral-600">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4 pb-4 border-b border-neutral-100">
        <div>
          <div className="text-xs text-neutral-500 mb-1">Pending</div>
          <div className="text-xl font-semibold text-neutral-700">{queue.pending.toLocaleString()}</div>
        </div>
        <div>
          <div className="text-xs text-neutral-500 mb-1">In Progress</div>
          <div className="text-xl font-semibold text-blue-600">{queue.inProgress}</div>
        </div>
        <div>
          <div className="text-xs text-neutral-500 mb-1">Failed</div>
          <div className="text-xl font-semibold text-red-600">{queue.failed}</div>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-neutral-500 mb-4">
        <div>Rate limit: <span className="font-mono text-neutral-700">{queue.rateLimit}</span></div>
        <div>Last: {queue.lastProcessed}</div>
      </div>

      {queue.failed > 0 && (
        <div className="flex items-center gap-2 text-xs text-red-700 bg-red-50 px-3 py-2 rounded mb-4">
          <AlertCircle className="w-4 h-4" />
          <span>{queue.failed} job{queue.failed > 1 ? 's' : ''} in dead-letter queue</span>
        </div>
      )}

      <div className="flex items-center gap-2">
        {queue.status === 'active' ? (
          <PauseQueueButton queue={queue} />
        ) : (
          <ResumeQueueButton queue={queue} />
        )}
        <button
          onClick={() => onSelectQueue(queue.id)}
          className="flex-1 px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-100 rounded transition-colors"
        >
          View Jobs
        </button>
        <button className="text-neutral-400 hover:text-neutral-600">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}