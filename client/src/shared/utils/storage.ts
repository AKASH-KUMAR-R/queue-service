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
