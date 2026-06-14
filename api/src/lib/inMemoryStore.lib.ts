export type ValueEntry = {
	type: "value";
	data: unknown;
	updatedAt: number;
};

export type CounterEntry = {
	type: "counter";
	counts: Record<string, number>;
	updatedAt: number;
};

export type RateLimitEntry = {
	type: "rateLimit";
	count: number;
	windowStart: number;
};

export type Entry = ValueEntry | CounterEntry | RateLimitEntry;

let store = new Map<string, Entry>();

const createCounterEntry = (): CounterEntry => ({
	type: "counter",
	counts: {},
	updatedAt: Date.now(),
});

/**
 * Stores an arbitrary value entry using last-write-wins semantics.
 *
 * @param key - Namespaced store key such as `worker:status:<workerId>`.
 * @param data - Arbitrary payload to associate with the key.
 */
export const setValue = (key: string, data: unknown): void => {
	store.set(key, {
		type: "value",
		data,
		updatedAt: Date.now(),
	});
};

/**
 * Increments one or more named counters for a key, creating the counter entry when missing.
 *
 * @param key - Namespaced store key such as `queue:metrics:<queueId>`.
 * @param deltas - Counter field deltas to merge into the current counts object.
 */
export const incrementCounters = (
	key: string,
	deltas: Record<string, number>,
): void => {
	const existingEntry = store.get(key);
	const counterEntry =
		existingEntry?.type === "counter"
			? {
				type: "counter" as const,
				counts: { ...existingEntry.counts },
				updatedAt: existingEntry.updatedAt,
			}
			: createCounterEntry();

	for (const [counterKey, delta] of Object.entries(deltas)) {
		counterEntry.counts[counterKey] =
			(counterEntry.counts[counterKey] ?? 0) + delta;
	}

	counterEntry.updatedAt = Date.now();
	store.set(key, counterEntry);
};

/**
 * Returns the current entry stored for a key.
 *
 * @param key - Namespaced store key to look up.
 * @returns The stored entry for the key, if present.
 */
export const getEntry = (key: string): Entry | undefined => {
	return store.get(key);
};

/**
 * Removes a single entry from the in-memory store.
 *
 * @param key - Namespaced store key to delete.
 */
export const removeKey = (key: string): void => {
	store.delete(key);
};

/**
 * Returns a snapshot of entries and clears them from the live store.
 *
 * @param prefix - Optional key prefix used to snapshot and clear only matching keys.
 * @returns A map containing the removed entries.
 */
export const getAllAndClear = (prefix?: string): Map<string, Entry> => {
	if (!prefix) {
		const currentStore = store;
		store = new Map<string, Entry>();
		return currentStore;
	}

	const snapshot = new Map<string, Entry>();

	for (const [key, entry] of store.entries()) {
		if (!key.startsWith(prefix)) {
			continue;
		}

		snapshot.set(key, entry);
		store.delete(key);
	}

	return snapshot;
};

/**
 * Returns whether the current fixed window is already at or above the limit.
 *
 * The entry is intentionally not reset here so callers can do a read-only
 * decision before deciding whether to record a successful dispatch.
 *
 * @param key - Namespaced rate-limit key, such as `ratelimit:<queueId>`.
 * @param limit - Maximum allowed operations within the current window.
 * @param windowMs - Fixed window length in milliseconds.
 * @returns `true` when the queue is currently rate limited.
 */
export const isRateLimited = (
	key: string,
	limit: number,
	windowMs: number,
): boolean => {
	const now = Date.now();
	const existingEntry = store.get(key);

	if (
		existingEntry?.type !== "rateLimit" ||
		now - existingEntry.windowStart >= windowMs
	) {
		return false;
	}

	return existingEntry.count >= limit;
};

/**
 * Records one successful dispatch in the current fixed window, creating a new
 * window when the prior one has expired.
 *
 * @param key - Namespaced rate-limit key, such as `ratelimit:<queueId>`.
 * @param windowMs - Fixed window length in milliseconds.
 */
export const recordRateLimitUsage = (key: string, windowMs: number): void => {
	const now = Date.now();
	const existingEntry = store.get(key);

	if (
		existingEntry?.type !== "rateLimit" ||
		now - existingEntry.windowStart >= windowMs
	) {
		store.set(key, {
			type: "rateLimit",
			count: 1,
			windowStart: now,
		});
		return;
	}

	store.set(key, {
		type: "rateLimit",
		count: existingEntry.count + 1,
		windowStart: existingEntry.windowStart,
	});
};
