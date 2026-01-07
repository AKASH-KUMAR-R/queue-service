import { useCallback, useState } from "react";

/**
 * Hook to manage multiple loading states by key (e.g., participantId).
 */
export function useMultiLoading() {
	const [loadingSet, setLoadingSet] = useState<Set<string>>(new Set());

	const startLoading = useCallback((key: string) => {
		setLoadingSet((prev) => new Set(prev).add(key));
	}, []);

	const stopLoading = useCallback((key: string) => {
		setLoadingSet((prev) => {
			const updated = new Set(prev);
			updated.delete(key);
			return updated;
		});
	}, []);

	const isLoading = useCallback(
		(key: string) => loadingSet.has(key),
		[loadingSet],
	);

	const clearAll = useCallback(() => {
		setLoadingSet(new Set());
	}, []);

	return { startLoading, stopLoading, isLoading, clearAll };
}
