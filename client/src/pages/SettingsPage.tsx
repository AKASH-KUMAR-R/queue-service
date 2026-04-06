import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { FormField } from "../shared/ui/form/FormField";
import { Input } from "../shared/ui/form/Input";
import { Label } from "../shared/ui/form/Label";

const settingsSchema = z.object({
	maxAttempts: z
		.number()
		.min(1, "Max attempts must be at least 1")
		.max(10, "Max attempts cannot exceed 10"),
	timeout: z.number().min(1, "Timeout must be at least 1 second"),
	retryDelay: z.number().min(0, "Retry delay cannot be negative"),
	alertFailureRate: z.boolean(),
	alertWorkerOffline: z.boolean(),
	alertJobLatency: z.boolean(),
});

type SettingsFormData = z.infer<typeof settingsSchema>;

export function SettingsPage() {
	const { register, handleSubmit } = useForm<SettingsFormData>({
		resolver: zodResolver(settingsSchema),
		defaultValues: {
			maxAttempts: 3,
			timeout: 30,
			retryDelay: 60,
			alertFailureRate: true,
			alertWorkerOffline: true,
			alertJobLatency: false,
		},
	});

	const onSubmit = (data: SettingsFormData) => {
		console.log("Saving settings:", data);
		// In real app, this would call an API
	};

	return (
		<div className="p-8">
			<div className="mb-6">
				<h1 className="text-2xl font-semibold text-foreground">
					Settings
				</h1>
				<p className="text-sm text-muted-foreground mt-1">
					Configure project and queue settings
				</p>
			</div>

			<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
				<div className="bg-card border border-border rounded-lg p-6">
					<h3 className="text-base font-medium text-card-foreground mb-4">
						Project Information
					</h3>
					<div className="grid grid-cols-12 gap-4">
						<div className="col-span-4">
							<FormField>
								<Label htmlFor="projectName">
									Project Name
								</Label>
								<Input
									id="projectName"
									value="prod-core-api"
									readOnly
									className="bg-muted"
								/>
							</FormField>
						</div>
						<div className="col-span-4">
							<FormField>
								<Label htmlFor="environment">Environment</Label>
								<Input
									id="environment"
									value="production"
									readOnly
									className="bg-muted"
								/>
							</FormField>
						</div>
						<div className="col-span-4">
							<FormField>
								<Label htmlFor="region">Region</Label>
								<Input
									id="region"
									value="us-east-1"
									readOnly
									className="bg-muted"
								/>
							</FormField>
						</div>
					</div>
				</div>

				<div className="bg-card border border-border rounded-lg p-6">
					<h3 className="text-base font-medium text-card-foreground mb-4">
						Default Queue Configuration
					</h3>
					<div className="grid grid-cols-12 gap-4">
						<div className="col-span-4">
							<FormField>
								<Label htmlFor="maxAttempts">
									Max Attempts
								</Label>
								<Input
									id="maxAttempts"
									type="number"
									min="1"
									max="10"
									required
								/>
							</FormField>
						</div>
						<div className="col-span-4">
							<FormField>
								<Label htmlFor="timeout">
									Timeout (seconds)
								</Label>
								<Input id="timeout" type="number" min="1" />
							</FormField>
						</div>
						<div className="col-span-4">
							<FormField>
								<Label htmlFor="retryDelay">
									Retry Delay (seconds)
								</Label>
								<Input
									id="retryDelay"
									type="number"
									min="0"
									required
								/>
							</FormField>
						</div>
					</div>
				</div>

				<div className="bg-card border border-border rounded-lg p-6">
					<h3 className="text-base font-medium text-card-foreground mb-4">
						Monitoring & Alerts
					</h3>
					<div className="space-y-3">
						<label className="flex items-center gap-3">
							<input
								type="checkbox"
								className="w-4 h-4"
								{...register("alertFailureRate")}
							/>
							<span className="text-sm text-foreground">
								Alert on queue failure rate &gt; 5%
							</span>
						</label>
						<label className="flex items-center gap-3">
							<input
								type="checkbox"
								className="w-4 h-4"
								{...register("alertWorkerOffline")}
							/>
							<span className="text-sm text-foreground">
								Alert on worker offline &gt; 5 minutes
							</span>
						</label>
						<label className="flex items-center gap-3">
							<input
								type="checkbox"
								className="w-4 h-4"
								{...register("alertJobLatency")}
							/>
							<span className="text-sm text-foreground">
								Alert on job latency &gt; p95 threshold
							</span>
						</label>
					</div>
				</div>

				<div className="flex gap-3">
					<button
						type="submit"
						className="px-4 py-2 bg-primary text-primary-foreground text-sm rounded hover:bg-primary/90 transition-colors"
					>
						Save Changes
					</button>
					<button
						type="button"
						className="px-4 py-2 bg-card border border-border text-sm text-foreground rounded hover:bg-accent transition-colors"
					>
						Cancel
					</button>
				</div>
			</form>
		</div>
	);
}
