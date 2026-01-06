import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="bg-white border border-neutral-200 rounded-lg p-12 text-center">
      <Inbox className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
      <h3 className="text-base font-medium text-neutral-900 mb-2">{title}</h3>
      <p className="text-sm text-neutral-600 mb-6 max-w-md mx-auto">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-4 py-2 bg-neutral-900 text-white text-sm rounded hover:bg-neutral-800 transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
