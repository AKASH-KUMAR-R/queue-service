import type { ApiKey } from "../model/types";
import { ApiKeyDisplay } from "./ApiKeyDisplay";
import { ApiKeyStatusBadge } from "./ApiKeyStatusBadge";

interface ApiKeyRowProps {
	apiKey: ApiKey;
	onRevoke: (apiKey: ApiKey) => void;
}

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

export function ApiKeyRow({ apiKey, onRevoke }: ApiKeyRowProps) {
	return (
		<tr className="border-b border-border hover:bg-accent">
			{/* Name & Description */}
			<td className="py-3 px-4">
				<div>
					<div className="text-sm text-foreground">{apiKey.name}</div>
					{apiKey.description && (
						<div className="text-xs text-muted-foreground mt-1">
							{apiKey.description}
						</div>
					)}
				</div>
			</td>

			{/* Key */}
			<td className="py-3 px-4">
				<ApiKeyDisplay prefix={apiKey.prefix} suffix={apiKey.suffix} />
			</td>

			{/* Status */}
			<td className="py-3 px-4">
				<ApiKeyStatusBadge status={apiKey.status} />
			</td>

			{/* Created */}
			<td className="py-3 px-4 text-sm text-muted-foreground">
				{formatRelativeTime(apiKey.createdAt)}
			</td>

			{/* Last Used */}
			<td className="py-3 px-4 text-sm text-muted-foreground">
				{apiKey.lastUsedAt ? (
					formatRelativeTime(apiKey.lastUsedAt)
				) : (
					<span className="text-muted-foreground">Never</span>
				)}
			</td>

			{/* Actions */}
			<td className="py-3 px-4">
				{apiKey.status === "active" ? (
					<button
						onClick={() => onRevoke(apiKey)}
						className="text-sm text-red-600 hover:text-red-700 hover:underline"
					>
						Revoke
					</button>
				) : (
					<span className="text-sm text-muted-foreground">—</span>
				)}
			</td>
		</tr>
	);
}
