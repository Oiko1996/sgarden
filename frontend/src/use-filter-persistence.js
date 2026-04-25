import { useCallback, useEffect, useRef, useState } from "react";

const readFromStorage = (key, defaultValue) => {
	if (typeof window === "undefined" || !window.localStorage) return defaultValue;
	try {
		const raw = window.localStorage.getItem(key);
		if (raw === null || raw === undefined) return defaultValue;
		return JSON.parse(raw);
	} catch {
		return defaultValue;
	}
};

const writeToStorage = (key, value) => {
	if (typeof window === "undefined" || !window.localStorage) return;
	try {
		if (value === undefined || value === null) {
			window.localStorage.removeItem(key);
			return;
		}

		window.localStorage.setItem(key, JSON.stringify(value));
	} catch {
		// no-op: quota or serialization issues are non-fatal for filter state
	}
};

const useFilterPersistence = (key, defaultValue) => {
	const defaultRef = useRef(defaultValue);
	const [value, setValue] = useState(() => readFromStorage(key, defaultRef.current));

	useEffect(() => {
		writeToStorage(key, value);
	}, [key, value]);

	const reset = useCallback(() => {
		setValue(defaultRef.current);
		writeToStorage(key, defaultRef.current);
	}, [key]);

	return [value, setValue, reset];
};

export default useFilterPersistence;
