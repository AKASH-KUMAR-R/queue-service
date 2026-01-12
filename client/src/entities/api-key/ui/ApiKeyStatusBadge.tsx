interface ApiKeyStatusBadgeProps {
	isRevoked: boolean;
}

export function ApiKeyStatusBadge({ isRevoked }: ApiKeyStatusBadgeProps) {
	if (!isRevoked) {
		return (
			<span className="inline-flex items-center px-2 py-1 rounded text-xs bg-green-50 text-green-700 border border-green-200">
				Active
			</span>
		);
	}

	return (
		<span className="inline-flex items-center px-2 py-1 rounded text-xs bg-red-50 text-red-700 border border-red-200">
			Revoked
		</span>
	);
}
