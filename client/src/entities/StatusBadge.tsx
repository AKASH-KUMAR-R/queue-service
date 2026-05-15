import { getStatusStyle } from "@entities/status/utils/style";

interface StatusBadgeProps {
	status: string;
	type: "queue" | "job" | "worker";
}

export function StatusBadge({ status }: StatusBadgeProps) {
	return (
		<span
			className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded border ${getStatusStyle(status)}`}
		>
			{status}
		</span>
	);
}
