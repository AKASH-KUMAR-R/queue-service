import { Button } from "@shared/ui/button";

import type { ApiKey } from "../model/types";
import { ApiKeyStatusBadge } from "./ApiKeyStatusBadge";

type ApiKeyRowProps = {
	apiKey: ApiKey;
	onRevoke: (apiKey: ApiKey) => void;
	rowNumber: number;
};

function formatRelativeTime(dateString: string): string {
	const date = new Date(dateString);
	const now = new Date();
	const diffMs = now.getTime() - date.getTime();
	const diffSecs = Math.floor(diffMs / 1000);
	const diffMins = Math.floor(diffSecs / 60);
	const diffHours = Math.floor(diffMins / 60);
	const diffDays = Math.floor(diffHours / 24);

	if (diffDays > 0) {
		return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
	} else if (diffHours > 0) {
		return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
	} else if (diffMins > 0) {
		return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
	} else {
		return "Just now";
	}
}

export function ApiKeyRow({ apiKey, onRevoke, rowNumber }: ApiKeyRowProps) {
	return (
		<tr className="border-b border-border hover:bg-accent">
			<td className="py-3 px-4">{rowNumber}</td>
			<td className="py-3 px-4">
				<ApiKeyStatusBadge isRevoked={apiKey.revoked} />
			</td>

			{/* Created */}
			<td className="py-3 px-4 text-sm text-muted-foreground">
				{formatRelativeTime(apiKey.createdAt)}
			</td>

			{/* Actions */}
			<td className="py-3 px-4">
				{!apiKey.revoked ? (
					<Button
						type="button"
						variant="destructive"
						onClick={() => onRevoke(apiKey)}
					>
						Revoke
					</Button>
				) : (
					<span className="text-sm text-muted-foreground">—</span>
				)}
			</td>
		</tr>
	);
}
