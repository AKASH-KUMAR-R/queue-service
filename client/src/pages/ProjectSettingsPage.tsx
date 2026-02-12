import { useForm } from "react-hook-form";

import { useProject } from "@app/ProjectContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@shared/ui/button";
import { Form } from "@shared/ui/form";
import { Input } from "@shared/ui/input";
import {
	RadixFormField,
	RadixFormItem,
	RadixFormLabel,
	RadixFormMessage,
} from "@shared/ui/radix-form";
import { mapServerFieldErrorToFormFields } from "@shared/utils/formUtils";

import {
	type ProjectUpdateFormErrorHandler,
	useProjectUpdate,
} from "@features/projects/data/projectUpdateForm";

const settingsSchema = z.object({
	label: z
		.string()
		.min(1, "Project name is required")
		.max(50, "Project name cannot exceed 50 characters"),
	description: z
		.string()
		.max(200, "Description cannot exceed 200 characters")
		.optional(),
});

export type UpdateProjectFormData = z.infer<typeof settingsSchema>;

export function ProjectSettingsPage() {
	const { currentProject, setCurrentProject } = useProject();

	if (!currentProject) {
		return (
			<div className="p-6">
				<p className="text-sm text-muted-foreground">
					No project selected. Please select a project to view and
					edit its settings.
				</p>
			</div>
		);
	}

	const form = useForm<UpdateProjectFormData>({
		resolver: zodResolver(settingsSchema),
		defaultValues: {
			label: currentProject?.label || "",
			description: currentProject?.description || "",
		},
	});

	const handleUpdateError: ProjectUpdateFormErrorHandler = (
		message,
		errors,
	) => {
		if (message) {
			toast.error(message);
		}

		if (errors) {
			mapServerFieldErrorToFormFields(form.setError, errors);
		}
	};

	const { mutate: updateProject, isPending } =
		useProjectUpdate(handleUpdateError);

	const handleSubmit = (data: UpdateProjectFormData) => {
		if (!currentProject) return;

		updateProject(
			{ projectId: currentProject.id, data },
			{
				onSuccess: (newProject) => {
					setCurrentProject(newProject.data);
					toast.success("Project updated successfully");
				},
			},
		);
	};

	return (
		<div className="p-6">
			<div className="mb-6">
				<h1 className="text-2xl font-semibold text-foreground">
					Project Settings
				</h1>
				<p className="text-sm text-muted-foreground mt-1">
					Configure project and queue settings
				</p>
			</div>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(handleSubmit)}
					className="space-y-6"
				>
					{/* Project Information */}
					<div className="bg-card border border-border rounded-lg p-6">
						<h3 className="text-base font-medium text-card-foreground mb-4">
							Project Information
						</h3>
						<div className="grid grid-cols-12 gap-4">
							<div className="col-span-4">
								<RadixFormField
									name="label"
									render={({ field }) => (
										<RadixFormItem>
											<RadixFormLabel htmlFor="projectName">
												Project Name
											</RadixFormLabel>
											<Input
												{...field}
												defaultValue={
													currentProject.label
												}
												type="text"
											/>
											<RadixFormMessage />
										</RadixFormItem>
									)}
								/>
							</div>

							<div className="col-span-4">
								<RadixFormField
									name="description"
									render={({ field }) => (
										<RadixFormItem>
											<RadixFormLabel htmlFor="projectDescription">
												Project Description
											</RadixFormLabel>
											<Input
												{...field}
												type="text"
												defaultValue={
													currentProject.description
												}
											/>
											<RadixFormMessage />
										</RadixFormItem>
									)}
								/>
							</div>
						</div>
					</div>

					{/* Monitoring & Alerts */}
					{/* <div className="bg-card border border-border rounded-lg p-6">
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
				</div> */}

					{/* Actions */}
					<div className="flex gap-3">
						<Button
							type="submit"
							className="px-4 py-2 "
							disabled={isPending}
						>
							{isPending ? "Saving..." : "Save Changes"}
						</Button>
					</div>
				</form>
			</Form>
		</div>
	);
}
