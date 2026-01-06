import { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { ConfirmDialog } from '../../shared/ui/ConfirmDialog';
import type { Worker } from '../../entities/worker/types';

interface DisconnectWorkerButtonProps {
  worker: Worker;
}

export function DisconnectWorkerButton({ worker }: DisconnectWorkerButtonProps) {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDisconnect = () => {
    console.log('Disconnect worker:', worker.id);
  };

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        className="flex items-center gap-1 px-2 py-1 text-xs text-red-700 hover:bg-red-50 rounded"
      >
        <AlertTriangle className="w-3 h-3" />
        Disconnect
      </button>

      <ConfirmDialog
        open={showConfirm}
        onOpenChange={setShowConfirm}
        title="Disconnect Worker"
        message={`Are you sure you want to disconnect worker "${worker.id}"? Active jobs will be reassigned to other workers.`}
        confirmLabel="Disconnect Worker"
        onConfirm={handleDisconnect}
        variant="danger"
      />
    </>
  );
}