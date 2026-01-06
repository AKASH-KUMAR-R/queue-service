import { createContext, useEffect, useState } from 'react';

/**
 * Theme types
 */
export type Theme = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

/**
 * Theme context interface
 */
interface ThemeContextType {
  /** Current theme setting (light, dark, or system) */
  theme: Theme;
  
  /** Set the theme preference */
  setTheme: (theme: Theme) => void;
  
  /** Actual theme being used (system resolved to light/dark) */
  resolvedTheme: ResolvedTheme;
}

/**
 * Theme context
 */
export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/**
 * Theme Provider Props
 */
interface ThemeProviderProps {
  children: React.ReactNode;
}

/**
 * Theme Provider Component
 * 
 * Manages theme state, system preference detection, and localStorage persistence.
 * Applies theme to document root for global styling.
 * 
 * Features:
 * - Three theme modes: light, dark, system
 * - Automatic OS preference detection
 * - localStorage persistence
 * - No flash on page load (when used with inline script)
 * - Smooth theme transitions
 */
export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(() => {
    // Try to load from localStorage
    try {
      const stored = localStorage.getItem('theme') as Theme | null;
      if (stored === 'light' || stored === 'dark' || stored === 'system') {
        return stored;
      }
    } catch (e) {
      console.warn('Failed to load theme from localStorage:', e);
    }
    return 'system'; // Default to system preference
  });

  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() => {
    // Initial resolution based on system preference
    if (typeof window !== 'undefined') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      return isDark ? 'dark' : 'light';
    }
    return 'light';
  });

  /**
   * Listen for system preference changes
   */
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
      if (theme === 'system') {
        const newResolvedTheme = e.matches ? 'dark' : 'light';
        setResolvedTheme(newResolvedTheme);
      }
    };

    // Initial check
    handleChange(mediaQuery);

    // Listen for changes
    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [theme]);

  /**
   * Apply theme to document root
   */
  useEffect(() => {
    const root = document.documentElement;
    const effectiveTheme = theme === 'system' ? resolvedTheme : theme;

    // Remove both classes first
    root.classList.remove('light', 'dark');
    
    // Add the effective theme class
    root.classList.add(effectiveTheme);

    // Set color-scheme for native form controls
    root.style.colorScheme = effectiveTheme;
  }, [theme, resolvedTheme]);

  /**
   * Save theme preference to localStorage
   */
  useEffect(() => {
    try {
      localStorage.setItem('theme', theme);
    } catch (e) {
      console.warn('Failed to save theme to localStorage:', e);
    }
  }, [theme]);

  /**
   * Update theme and resolve if needed
   */
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);

    // If switching to system, resolve immediately
    if (newTheme === 'system') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setResolvedTheme(isDark ? 'dark' : 'light');
    } else {
      // For explicit light/dark, set resolved theme to match
      setResolvedTheme(newTheme);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
