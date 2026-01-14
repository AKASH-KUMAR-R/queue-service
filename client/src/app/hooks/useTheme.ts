import { useContext } from "react";

import { ThemeContext } from "../ThemeProvider";

/**
 * useTheme Hook
 *
 * Access theme state and controls from any component.
 * Must be used within a ThemeProvider.
 *
 * @returns Theme context with current theme, setTheme function, and resolved theme
 * @throws Error if used outside ThemeProvider
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { theme, setTheme, resolvedTheme } = useTheme();
 *
 *   return (
 *     <button onClick={() => setTheme('dark')}>
 *       Current: {theme} (resolved: {resolvedTheme})
 *     </button>
 *   );
 * }
 * ```
 */
export function useTheme() {
	const context = useContext(ThemeContext);

	if (context === undefined) {
		throw new Error(
			"useTheme must be used within a ThemeProvider. " +
				"Make sure your app is wrapped with <ThemeProvider>.",
		);
	}

	return context;
}
