/**
 * Navigation Bar Configuration
 *
 * This file defines the navigation structure, types, and utility functions
 * for the sidebar navigation in the QaaS dashboard.
 *
 * Following Feature-Sliced Architecture and QaaS Guidelines:
 * - Project: Current project-level features
 * - Queue Management: Operational queue tasks
 * - General: User preferences and app settings
 */
import { BarChart3, Key, Layers, Palette, Settings } from "lucide-react";

// ============================================================================
// Types & Interfaces
// ============================================================================

/**
 * Individual navigation item
 */
export interface NavItem {
	/** Unique path for routing (e.g., '/queues', '/project/settings') */
	path: string;

	/** Display label for the navigation item */
	label: string;

	/** Icon component from lucide-react */
	icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;

	/** Optional badge to display (e.g., count, "New", status) */
	badge?: string | number;

	/** Optional description for tooltips or accessibility */
	description?: string;
}

/**
 * Navigation group containing multiple nav items
 */
export interface NavGroup {
	/** Unique identifier for the group */
	id: string;

	/** Display label for the group header */
	label: string;

	/** Whether the group can be collapsed/expanded */
	collapsible?: boolean;

	/** Default expanded state (if collapsible) */
	defaultExpanded?: boolean;

	/** Array of navigation items in this group */
	items: NavItem[];

	/** Optional icon for the group header */
	icon?: React.ReactNode;

	/** Optional description for the group */
	description?: string;
}

/**
 * State object for tracking which groups are expanded
 */
export type ExpandedGroupsState = Record<string, boolean>;

// ============================================================================
// Navigation Configuration
// ============================================================================

/**
 * Main navigation groups configuration
 *
 * This defines the entire sidebar navigation structure.
 * Order matters - groups are rendered in array order.
 */
export const navGroups: NavGroup[] = [
	// --------------------------------------------------------------------------
	// PROJECT Group
	// --------------------------------------------------------------------------
	{
		id: "project",
		label: "Project",
		collapsible: false, // Always visible - most important context
		description: "Current project settings and resources",
		items: [
			{
				path: "/project/statistics",
				label: "Statistics",
				icon: BarChart3,
				description: "Project-level analytics and insights",
			},
			{
				path: "/project/api-keys",
				label: "API Keys",
				icon: Key,
				description: "Manage API keys and authentication",
			},
			{
				path: "/project/settings",
				label: "Settings",
				icon: Settings,
				description: "Configure project settings",
			},
		],
	},

	// --------------------------------------------------------------------------
	// QUEUE MANAGEMENT Group
	// --------------------------------------------------------------------------
	{
		id: "queues",
		label: "Queue Management",
		collapsible: true,
		defaultExpanded: true, // Frequently used, expanded by default
		description: "Manage queues, jobs, and workers",
		items: [
			{
				path: "/queues",
				label: "Queues",
				icon: Layers,
				description: "View and manage all queues",
			},
			// {
			// 	path: "/jobs",
			// 	label: "Jobs",
			// 	icon: Briefcase,
			// 	description: "Monitor and manage jobs",
			// },
			// {
			// 	path: "/workers",
			// 	label: "Workers",
			// 	icon: Users,
			// 	description: "Track worker health and status",
			// },
		],
	},

	// --------------------------------------------------------------------------
	// GENERAL Group
	// --------------------------------------------------------------------------
	{
		id: "general",
		label: "General",
		collapsible: true,
		defaultExpanded: false, // Infrequently used, collapsed by default
		description: "Application preferences and settings",
		items: [
			{
				path: "/general/settings/appearance",
				label: "Appearance",
				icon: Palette,
				description: "Customize theme and display",
			},
			// Future items:
			// { path: '/settings/notifications', label: 'Notifications', icon: <Bell /> },
			// { path: '/settings/preferences', label: 'Preferences', icon: <Sliders /> },
		],
	},
];

export const NAVBAR_RESTRICTED_PATHS: string[] = [
	"sign-up",
	"register",
	"forgot-password",
	"reset-password",
	"",
];

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Get the default expanded state for all groups
 *
 * This initializes the expanded state based on group configuration.
 * Groups that are not collapsible are always expanded.
 *
 * @returns Object mapping group IDs to their expanded state
 */
export function getDefaultExpandedState(): ExpandedGroupsState {
	const state: ExpandedGroupsState = {};

	navGroups.forEach((group) => {
		// Non-collapsible groups are always expanded
		if (!group.collapsible) {
			state[group.id] = true;
		} else {
			// Use defaultExpanded if specified, otherwise false
			state[group.id] = group.defaultExpanded ?? false;
		}
	});

	return state;
}

/**
 * Get the expanded state with auto-expansion for active route
 *
 * This ensures the group containing the currently active page is expanded,
 * improving UX by revealing the active navigation item.
 *
 * @param currentPath - Current route path (e.g., '/queues', '/project/settings')
 * @returns Object mapping group IDs to their expanded state
 */
export function getExpandedStateForRoute(
	currentPath: string,
): ExpandedGroupsState {
	const state = getDefaultExpandedState();

	// Find which group contains the active route
	navGroups.forEach((group) => {
		const hasActiveItem = group.items.some(
			(item) => item.path === currentPath,
		);

		if (hasActiveItem && group.collapsible) {
			// Auto-expand group containing active item
			state[group.id] = true;
		}
	});

	return state;
}

/**
 * Find the navigation item for a given path
 *
 * Useful for getting item metadata (label, icon, description) from a route path.
 *
 * @param path - Route path to search for
 * @returns NavItem if found, undefined otherwise
 */
export function findNavItemByPath(path: string): NavItem | undefined {
	for (const group of navGroups) {
		const item = group.items.find((item) => item.path === path);
		if (item) return item;
	}
	return undefined;
}

/**
 * Find the navigation group containing a given path
 *
 * Useful for determining which group a route belongs to.
 *
 * @param path - Route path to search for
 * @returns NavGroup if found, undefined otherwise
 */
export function findGroupByPath(path: string): NavGroup | undefined {
	return navGroups.find((group) =>
		group.items.some((item) => item.path === path),
	);
}

/**
 * Get all navigation paths as a flat array
 *
 * Useful for route validation or generating route configs.
 *
 * @returns Array of all navigation paths
 */
export function getAllNavPaths(): string[] {
	return navGroups.flatMap((group) => group.items.map((item) => item.path));
}

/**
 * Check if a path is a valid navigation path
 *
 * @param path - Path to validate
 * @returns True if path exists in navigation config
 */
export function isValidNavPath(path: string): boolean {
	return getAllNavPaths().includes(path);
}

/**
 * Get navigation breadcrumbs for a given path
 *
 * Returns the group and item for generating breadcrumb navigation.
 *
 * @param path - Current route path
 * @returns Object with group and item, or null if not found
 */
export function getNavBreadcrumbs(path: string): {
	group: NavGroup;
	item: NavItem;
} | null {
	const group = findGroupByPath(path);
	const item = findNavItemByPath(path);

	if (group && item) {
		return { group, item };
	}

	return null;
}

/**
 * Filter navigation groups by a search query
 *
 * Useful for implementing search/filter functionality in the sidebar.
 *
 * @param query - Search query string
 * @returns Filtered groups containing only matching items
 */
export function filterNavGroups(query: string): NavGroup[] {
	if (!query.trim()) return navGroups;

	const lowerQuery = query.toLowerCase();

	return navGroups
		.map((group) => ({
			...group,
			items: group.items.filter(
				(item) =>
					item.label.toLowerCase().includes(lowerQuery) ||
					item.description?.toLowerCase().includes(lowerQuery),
			),
		}))
		.filter((group) => group.items.length > 0); // Only include groups with matches
}

/**
 * Get count of total navigation items
 *
 * @returns Total number of nav items across all groups
 */
export function getTotalNavItemCount(): number {
	return navGroups.reduce((total, group) => total + group.items.length, 0);
}

/**
 * Get count of navigation items in a specific group
 *
 * @param groupId - ID of the group
 * @returns Number of items in the group, or 0 if group not found
 */
export function getGroupItemCount(groupId: string): number {
	const group = navGroups.find((g) => g.id === groupId);
	return group ? group.items.length : 0;
}

// ============================================================================
// Constants
// ============================================================================

/**
 * Route redirects for backward compatibility
 *
 * Maps old paths to new paths. Useful in router configuration.
 */
export const ROUTE_REDIRECTS: Record<string, string> = {
	"/settings": "/project/settings", // Old settings route redirects to project settings
};

/**
 * Default group IDs for easy reference
 */
export const GROUP_IDS = {
	PROJECT: "project",
	QUEUES: "queues",
	GENERAL: "general",
} as const;

/**
 * Navigation configuration metadata
 */
export const NAV_CONFIG_META = {
	version: "1.0.0",
	lastUpdated: "2026-01-06",
	totalGroups: navGroups.length,
	totalItems: getTotalNavItemCount(),
} as const;
