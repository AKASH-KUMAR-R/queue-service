export const getValueFromLocalStorage = <T>(
	key: string,
	defaultValue: T,
): T => {
	try {
		if (typeof window === "undefined") {
			return defaultValue;
		}

		const item = window.localStorage.getItem(key);
		return item ? (JSON.parse(item) as T) : defaultValue;
	} catch (err) {
		console.warn(`Error reading localStorage key "${key}":`, err);
		return defaultValue;
	}
};

export const setValueInLocalStorage = <T>(key: string, value: T): void => {
	try {
		if (typeof window === "undefined") {
			return;
		}
		window.localStorage.setItem(key, JSON.stringify(value));
	} catch (err) {
		console.warn(`Error setting localStorage key "${key}":`, err);
	}
};

export const removeValueFromLocalStorage = (key: string): void => {
	try {
		if (typeof window === "undefined") {
			return;
		}
		window.localStorage.removeItem(key);
	} catch (err) {
		console.warn(`Error removing localStorage key "${key}":`, err);
	}
};

export const clearLocalStorage = (): void => {
	try {
		if (typeof window === "undefined") {
			return;
		}
		window.localStorage.clear();
	} catch (err) {
		console.warn("Error clearing localStorage:", err);
	}
};
