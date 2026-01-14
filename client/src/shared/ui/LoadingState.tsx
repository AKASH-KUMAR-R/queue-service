export function LoadingState() {
	return (
		<div className="bg-white border border-neutral-200 rounded-lg p-8">
			<div className="animate-pulse space-y-4">
				<div className="h-4 bg-neutral-200 rounded w-1/4"></div>
				<div className="space-y-3">
					<div className="h-12 bg-neutral-200 rounded"></div>
					<div className="h-12 bg-neutral-200 rounded"></div>
					<div className="h-12 bg-neutral-200 rounded"></div>
					<div className="h-12 bg-neutral-200 rounded"></div>
					<div className="h-12 bg-neutral-200 rounded"></div>
				</div>
			</div>
		</div>
	);
}
