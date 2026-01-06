import { useTheme } from "@app/hooks/useTheme";
import { Monitor, Moon, Palette, Sun } from "lucide-react";

/**
 * Appearance Settings Page
 *
 * Allows users to customize the look and feel of the dashboard:
 * - Theme selection (light/dark/system)
 * - Font size preferences (future)
 * - Color scheme (future)
 * - Display density (future)
 *
 * Following QaaS Guidelines:
 * - Desktop-first layout
 * - 14px base font
 * - Neutral color palette
 * - Functional, engineering-focused
 */
export function AppearanceSettingsPage() {
	const { theme, setTheme, resolvedTheme } = useTheme();

	return (
		<div className="p-6">
			{/* Page Header */}
			<div className="mb-6">
				<h1 className="text-2xl font-semibold text-foreground">
					Appearance
				</h1>
				<p className="text-sm text-muted-foreground mt-1">
					Customize the look and feel of your dashboard
				</p>
			</div>

			{/* Theme Section */}
			<div className="bg-card border border-border rounded-lg p-6 mb-6">
				<div className="flex items-start gap-4 mb-6">
					<Palette className="w-5 h-5 text-muted-foreground mt-0.5" />
					<div className="flex-1">
						<h2 className="text-base font-medium text-card-foreground mb-1">
							Theme
						</h2>
						<p className="text-sm text-muted-foreground mb-6">
							Select your preferred theme or use system preference
						</p>

						{/* Theme Selection */}
						<div className="space-y-3">
							{/* Light Theme */}
							<label className="flex items-start gap-3 p-4 border border-border rounded-md cursor-pointer hover:bg-accent transition-colors">
								<input
									type="radio"
									name="theme"
									value="light"
									checked={theme === "light"}
									onChange={() => setTheme("light")}
									className="mt-0.5 w-4 h-4 accent-primary"
								/>
								<div className="flex-1">
									<div className="flex items-center gap-2 mb-1">
										<Sun className="w-4 h-4 text-foreground" />
										<span className="text-sm font-medium text-card-foreground">
											Light
										</span>
									</div>
									<p className="text-xs text-muted-foreground">
										Clean and bright interface for well-lit
										environments
									</p>
								</div>
							</label>

							{/* Dark Theme */}
							<label className="flex items-start gap-3 p-4 border border-border rounded-md cursor-pointer hover:bg-accent transition-colors">
								<input
									type="radio"
									name="theme"
									value="dark"
									checked={theme === "dark"}
									onChange={() => setTheme("dark")}
									className="mt-0.5 w-4 h-4 accent-primary"
								/>
								<div className="flex-1">
									<div className="flex items-center gap-2 mb-1">
										<Moon className="w-4 h-4 text-foreground" />
										<span className="text-sm font-medium text-card-foreground">
											Dark
										</span>
									</div>
									<p className="text-xs text-muted-foreground">
										Reduced eye strain in low-light
										environments
									</p>
								</div>
							</label>

							{/* System Theme */}
							<label className="flex items-start gap-3 p-4 border border-border rounded-md cursor-pointer hover:bg-accent transition-colors">
								<input
									type="radio"
									name="theme"
									value="system"
									checked={theme === "system"}
									onChange={() => setTheme("system")}
									className="mt-0.5 w-4 h-4 accent-primary"
								/>
								<div className="flex-1">
									<div className="flex items-center gap-2 mb-1">
										<Monitor className="w-4 h-4 text-foreground" />
										<span className="text-sm font-medium text-card-foreground">
											System
										</span>
									</div>
									<p className="text-xs text-muted-foreground">
										Automatically match your operating
										system preference
										{theme === "system" && (
											<span className="block mt-1 text-muted-foreground">
												Currently using:{" "}
												<span className="font-medium">
													{resolvedTheme}
												</span>{" "}
												theme
											</span>
										)}
									</p>
								</div>
							</label>
						</div>
					</div>
				</div>

				{/* Theme Preview (Optional) */}
				<div className="mt-6 pt-6 border-t border-border">
					<h3 className="text-sm font-medium text-card-foreground mb-3">
						Preview
					</h3>
					<div className="flex gap-3">
						{/* Light Preview */}
						<div className="flex-1 p-3 bg-white border border-neutral-200 rounded">
							<div className="w-full h-2 bg-neutral-900 rounded mb-2"></div>
							<div className="w-3/4 h-2 bg-neutral-300 rounded mb-1"></div>
							<div className="w-1/2 h-2 bg-neutral-300 rounded"></div>
						</div>

						{/* Dark Preview */}
						<div className="flex-1 p-3 bg-neutral-900 border border-neutral-800 rounded">
							<div className="w-full h-2 bg-neutral-50 rounded mb-2"></div>
							<div className="w-3/4 h-2 bg-neutral-700 rounded mb-1"></div>
							<div className="w-1/2 h-2 bg-neutral-700 rounded"></div>
						</div>
					</div>
				</div>
			</div>

			{/* Display Density Section (Future) */}
			<div className="bg-card border border-border rounded-lg p-6 mb-6">
				<div className="flex items-start gap-4">
					<div className="flex-1">
						<h2 className="text-base font-medium text-card-foreground mb-1">
							Display Density
						</h2>
						<p className="text-sm text-muted-foreground mb-4">
							Adjust the spacing and size of UI elements
						</p>

						{/* Placeholder for density options */}
						<div className="text-sm text-muted-foreground bg-muted p-4 rounded border border-border">
							Display density options will be available in a
							future update
						</div>
					</div>
				</div>
			</div>

			{/* Future Settings Placeholder */}
			<div className="bg-muted border border-border rounded-lg p-6">
				<p className="text-sm text-muted-foreground">
					Additional appearance settings will be added in future
					updates:
				</p>
				<ul className="mt-2 space-y-1 text-sm text-muted-foreground list-disc list-inside">
					<li>Font size customization</li>
					<li>Accent color selection</li>
					<li>Compact/comfortable view modes</li>
					<li>High contrast mode</li>
				</ul>
			</div>
		</div>
	);
}
