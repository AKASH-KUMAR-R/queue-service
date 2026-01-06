import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Dialog, DialogContent } from "../../shared/ui/Dialog";
import { Input } from "../../shared/ui/form/Input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../../shared/ui/form/Select";
import {
	RadixForm,
	RadixFormControl,
	RadixFormDescription,
	RadixFormField,
	RadixFormItem,
	RadixFormLabel,
	RadixFormMessage,
} from "../../shared/ui/radix-form";

const createProjectSchema = z.object({
	name: z
		.string()
		.min(1, "Project name is required")
		.max(50, "Project name cannot exceed 50 characters")
		.regex(
			/^[a-z0-9-]+$/,
			"Project name must contain only lowercase letters, numbers, and hyphens",
		)
		.refine(
			(val) => !val.startsWith("-") && !val.endsWith("-"),
			"Project name cannot start or end with a hyphen",
		),
	environment: z.enum(["production", "staging", "development"], {
		required_error: "Environment is required",
		invalid_type_error: "Please select a valid environment",
	}),
	region: z.string().min(1, "Region is required"),
});

export type CreateProjectFormData = z.infer<typeof createProjectSchema>;

interface CreateProjectDialogProps {
	open: boolean;
	onClose: () => void;
	onSubmit: (data: CreateProjectFormData) => void;
	organization: string;
}

export function CreateProjectDialog({
	open,
	onClose,
	onSubmit,
	organization,
}: CreateProjectDialogProps) {
	const form = useForm<CreateProjectFormData>({
		resolver: zodResolver(createProjectSchema),
		defaultValues: {
			name: "",
			environment: "development",
			region: "us-east-1",
		},
	});

	const { handleSubmit, control, reset } = form;

	const handleFormSubmit = (data: CreateProjectFormData) => {
		onSubmit(data);
		reset();
		onClose();
	};

	const handleOpenChange = (isOpen: boolean) => {
		if (!isOpen) {
			reset();
			onClose();
		}
	};

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogContent
				title="Create New Project"
				description={`Create a new project in organization: ${organization}`}
				aria-describedby="create-project-description"
			>
				<RadixForm {...form}>
					<form onSubmit={handleSubmit(handleFormSubmit)}>
						<div className="p-6 space-y-4">
							{/* Project Name Field */}
							<RadixFormField
								control={control}
								name="name"
								render={({ field }) => (
									<RadixFormItem>
										<RadixFormLabel>
											Project Name
										</RadixFormLabel>
										<RadixFormControl>
											<Input
												placeholder="my-project-name"
												{...field}
											/>
										</RadixFormControl>
										<RadixFormDescription>
											Use lowercase letters, numbers, and
											hyphens only
										</RadixFormDescription>
										<RadixFormMessage />
									</RadixFormItem>
								)}
							/>

							{/* Environment Field */}
							<RadixFormField
								control={control}
								name="environment"
								render={({ field }) => (
									<RadixFormItem>
										<RadixFormLabel>
											Environment
										</RadixFormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<RadixFormControl>
												<SelectTrigger>
													<SelectValue placeholder="Select environment" />
												</SelectTrigger>
											</RadixFormControl>
											<SelectContent>
												<SelectItem value="development">
													Development
												</SelectItem>
												<SelectItem value="staging">
													Staging
												</SelectItem>
												<SelectItem value="production">
													Production
												</SelectItem>
											</SelectContent>
										</Select>
										<RadixFormMessage />
									</RadixFormItem>
								)}
							/>

							{/* Region Field */}
							<RadixFormField
								control={control}
								name="region"
								render={({ field }) => (
									<RadixFormItem>
										<RadixFormLabel>Region</RadixFormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<RadixFormControl>
												<SelectTrigger>
													<SelectValue placeholder="Select region" />
												</SelectTrigger>
											</RadixFormControl>
											<SelectContent>
												<SelectItem value="us-east-1">
													US East (N. Virginia)
												</SelectItem>
												<SelectItem value="us-west-2">
													US West (Oregon)
												</SelectItem>
												<SelectItem value="eu-west-1">
													EU (Ireland)
												</SelectItem>
												<SelectItem value="eu-central-1">
													EU (Frankfurt)
												</SelectItem>
												<SelectItem value="ap-southeast-1">
													Asia Pacific (Singapore)
												</SelectItem>
												<SelectItem value="ap-northeast-1">
													Asia Pacific (Tokyo)
												</SelectItem>
											</SelectContent>
										</Select>
										<RadixFormMessage />
									</RadixFormItem>
								)}
							/>

							{/* Default Configuration Summary */}
							<div className="bg-neutral-50 border border-neutral-200 rounded p-4">
								<h4 className="text-sm text-neutral-900 mb-2">
									Default Configuration
								</h4>
								<div className="space-y-1 text-xs text-neutral-600">
									<div>
										Max Attempts:{" "}
										<span className="text-neutral-900">
											3
										</span>
									</div>
									<div>
										Timeout:{" "}
										<span className="text-neutral-900">
											30s
										</span>
									</div>
									<div>
										Retry Delay:{" "}
										<span className="text-neutral-900">
											60s
										</span>
									</div>
								</div>
								<p className="text-xs text-neutral-500 mt-2">
									These can be customized in project settings
									after creation
								</p>
							</div>
						</div>

						{/* Footer Actions */}
						<div className="flex items-center justify-end gap-3 p-6 border-t border-neutral-200 sticky bottom-0 bg-white">
							<button
								type="button"
								onClick={() => handleOpenChange(false)}
								className="px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 rounded transition-colors"
							>
								Cancel
							</button>
							<button
								type="submit"
								className="px-4 py-2 text-sm bg-neutral-900 text-white rounded hover:bg-neutral-800 transition-colors"
							>
								Create Project
							</button>
						</div>
					</form>
				</RadixForm>
			</DialogContent>
		</Dialog>
	);
}
