import { Plus } from 'lucide-react';

interface CreateQueueButtonProps {
  onClick: () => void;
}

export function CreateQueueButton({ onClick }: CreateQueueButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-2 text-sm bg-neutral-900 text-white rounded hover:bg-neutral-800 transition-colors"
    >
      <Plus className="w-4 h-4" />
      Create Queue
    </button>
  );
}
