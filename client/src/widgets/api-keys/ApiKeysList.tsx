import { Key } from "lucide-react";

import type { ApiKey } from "../../entities/api-key/model/types";
import { ApiKeyRow } from "../../entities/api-key/ui/ApiKeyRow";

interface ApiKeysListProps {
	apiKeys: ApiKey[];
	onRevoke: (apiKey: ApiKey) => void;
	loading?: boolean;
	onCreateClick: () => void;
}

function EmptyState({ onCreateClick }: { onCreateClick: () => void }) {
	return (
		<div className="text-center py-12">
			<div className="inline-flex items-center justify-center w-16 h-16 bg-muted rounded-full mb-4">
				<Key className="w-8 h-8 text-muted-foreground" />
			</div>
			<h3 className="text-base text-foreground mb-2">No API Keys Yet</h3>
			<p className="text-sm text-muted-foreground mb-6">
				Generate your first API key to start authenticating API requests
			</p>
			<button
				onClick={onCreateClick}
				className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
			>
				Generate API Key
			</button>
		</div>
	);
}

function LoadingSkeleton() {
	return (
		<div className="space-y-3">
			{[1, 2, 3].map((i) => (
				<div
					key={i}
					className="border border-border rounded p-4 animate-pulse"
				>
					<div className="flex items-center gap-4">
						<div className="flex-1">
							<div className="h-4 bg-muted rounded w-48 mb-2"></div>
							<div className="h-3 bg-muted rounded w-32"></div>
						</div>
						<div className="h-6 bg-muted rounded w-16"></div>
					</div>
				</div>
			))}
		</div>
	);
}

export function ApiKeysList({
	apiKeys,
	onRevoke,
	loading,
	onCreateClick,
}: ApiKeysListProps) {
	if (loading) {
		return <LoadingSkeleton />;
	}

	if (apiKeys.length === 0) {
		return <EmptyState onCreateClick={onCreateClick} />;
	}

	return (
		<div className="border border-border rounded overflow-hidden">
			<div className="overflow-x-auto">
				<table className="w-full">
					<thead className="bg-muted border-b border-border">
						<tr>
							<th className="py-3 px-4 text-left text-xs text-muted-foreground uppercase tracking-wider">
								SI
							</th>
							<th className="py-3 px-4 text-left text-xs text-muted-foreground uppercase tracking-wider">
								Status
							</th>
							<th className="py-3 px-4 text-left text-xs text-muted-foreground uppercase tracking-wider">
								Created
							</th>
							<th className="py-3 px-4 text-left text-xs text-muted-foreground uppercase tracking-wider">
								Actions
							</th>
						</tr>
					</thead>
					<tbody>
						{apiKeys.map((apiKey, index) => (
							<ApiKeyRow
								key={apiKey.id}
								rowNumber={index + 1}
								apiKey={apiKey}
								onRevoke={onRevoke}
							/>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
