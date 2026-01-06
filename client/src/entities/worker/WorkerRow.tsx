import { Copy } from 'lucide-react';
import { StatusBadge } from '../StatusBadge';
import { DisconnectWorkerButton } from '../../features/workers/DisconnectWorkerButton';
import { copyToClipboard } from '../../shared/utils/clipboard';
import type { Worker } from './types';

interface WorkerRowProps {
  worker: Worker;
}

export function WorkerRow({ worker }: WorkerRowProps) {
  const handleCopy = async (text: string) => {
    const success = await copyToClipboard(text);
    if (!success) {
      // Optionally show a toast or error message
      console.error('Failed to copy to clipboard');
    }
  };

  return (
    <tr className="hover:bg-neutral-50">
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm text-neutral-900">{worker.id}</span>
          <button
            onClick={() => handleCopy(worker.id)}
            className="text-neutral-400 hover:text-neutral-600"
          >
            <Copy className="w-3 h-3" />
          </button>
        </div>
      </td>
      <td className="px-4 py-3">
        <StatusBadge status={worker.status} type="worker" />
      </td>
      <td className="px-4 py-3">
        <span className="text-sm text-neutral-700">{worker.activeJobs}</span>
      </td>
      <td className="px-4 py-3">
        <span className="text-xs text-neutral-600">{worker.lastHeartbeat}</span>
      </td>
      <td className="px-4 py-3">
        <div className="flex flex-wrap gap-1">
          {worker.queues.map((queue) => (
            <span key={queue} className="text-xs bg-neutral-100 text-neutral-700 px-2 py-1 rounded">
              {queue}
            </span>
          ))}
        </div>
      </td>
      <td className="px-4 py-3">
        <span className="text-sm text-neutral-700">{worker.uptimeHours.toFixed(1)}h</span>
      </td>
      <td className="px-4 py-3">
        <span className="text-sm text-neutral-700">{worker.processedTotal.toLocaleString()}</span>
      </td>
      <td className="px-4 py-3">
        {worker.status === 'online' && <DisconnectWorkerButton worker={worker} />}
      </td>
    </tr>
  );
}