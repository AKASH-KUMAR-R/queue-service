import { Grid, List, Search } from 'lucide-react';

export type QueueViewMode = 'card' | 'list';

interface QueueViewControlsProps {
  viewMode: QueueViewMode;
  onViewModeChange: (mode: QueueViewMode) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function QueueViewControls({
  viewMode,
  onViewModeChange,
  searchQuery,
  onSearchChange,
}: QueueViewControlsProps) {
  return (
    <div className="flex items-center justify-between gap-4 mb-6">
      <div className="flex-1 max-w-md relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
        <input
          type="text"
          placeholder="Search queues by name or ID..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 text-sm border border-neutral-200 rounded bg-white text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
        />
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xs text-neutral-600 mr-2">View:</span>
        <div className="flex gap-1 bg-neutral-100 rounded p-1">
          <button
            onClick={() => onViewModeChange('card')}
            className={`flex items-center gap-2 px-3 py-1.5 text-sm rounded transition-colors ${
              viewMode === 'card'
                ? 'bg-white text-neutral-900 shadow-sm'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <Grid className="w-4 h-4" />
            Card
          </button>
          <button
            onClick={() => onViewModeChange('list')}
            className={`flex items-center gap-2 px-3 py-1.5 text-sm rounded transition-colors ${
              viewMode === 'list'
                ? 'bg-white text-neutral-900 shadow-sm'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <List className="w-4 h-4" />
            List
          </button>
        </div>
      </div>
    </div>
  );
}
