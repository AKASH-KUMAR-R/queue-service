import { CopyButton } from '../../../shared/ui/CopyButton';

interface ApiKeyDisplayProps {
  prefix: string;
  suffix: string;
  fullKey?: string;
  showCopyButton?: boolean;
}

export function ApiKeyDisplay({ prefix, suffix, fullKey, showCopyButton = false }: ApiKeyDisplayProps) {
  // Full key display (one-time only)
  if (fullKey) {
    return (
      <div className="flex items-center gap-2 p-3 bg-muted border border-border rounded">
        <code className="flex-1 font-mono text-sm text-foreground break-all">
          {fullKey}
        </code>
        {showCopyButton && <CopyButton value={fullKey} label="Copy" size="sm" />}
      </div>
    );
  }

  // Masked display (default)
  return (
    <code className="font-mono text-xs text-muted-foreground">
      {prefix}...{suffix}
    </code>
  );
}