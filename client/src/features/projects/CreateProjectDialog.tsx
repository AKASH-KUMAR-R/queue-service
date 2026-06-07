import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@shared/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@shared/ui/dialog";
import { Input } from "@shared/ui/input";
import {
	RadixForm,
	RadixFormControl,
	RadixFormDescription,
	RadixFormField,
	RadixFormItem,
	RadixFormLabel,
	RadixFormMessage,
} from "@shared/ui/radix-form";
import { mapServerFieldErrorToFormFields } from "@shared/utils/formUtils";

import type { Project } from "@entities/project/types";

import {
	type ProjectCreateFormErrorHandler,
	useProjectCreate,
} from "./data/projectCreateForm";

const createProjectSchema = z.object({
	label: z
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

	description: z
		.string()
		.max(200, "Description cannot exceed 200 characters")
		.optional(),
});

export type CreateProjectFormData = z.infer<typeof createProjectSchema>;

type CreateProjectDialogProps = {
	open: boolean;
	onClose: () => void;
	onSubmit: (data: Project) => void;
};

export function CreateProjectDialog({
	open,
	onClose,
	onSubmit,
}: CreateProjectDialogProps) {
	const form = useForm<CreateProjectFormData>({
		resolver: zodResolver(createProjectSchema),
		defaultValues: {
			label: "",
			description: "",
		},
	});

	const { handleSubmit, control, reset } = form;

	const handleProjectCreateError: ProjectCreateFormErrorHandler = (
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

	const { mutate: createProject } = useProjectCreate(
		handleProjectCreateError,
	);

	const handleFormSubmit = (data: CreateProjectFormData) => {
		createProject(data, {
			onSuccess: (newProjectRes) => {
				toast.success("Project created successfully!");
				onSubmit(newProjectRes.data);
				reset();
				onClose();
			},
		});
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
				showCloseButton={false}
				title="Create New Project"
				aria-describedby="create-project-description"
			>
				<DialogHeader>
					<DialogTitle>Create New Project</DialogTitle>
				</DialogHeader>

				<RadixForm {...form}>
					<form onSubmit={handleSubmit(handleFormSubmit)}>
						<div className="p-6 space-y-4">
							{/* Project Name Field */}
							<RadixFormField
								control={control}
								name="label"
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
							<RadixFormField
								control={control}
								name="description"
								render={({ field }) => (
									<RadixFormItem>
										<RadixFormLabel>
											Project Description
										</RadixFormLabel>
										<RadixFormControl>
											<Input
												placeholder="my-project-description"
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
						</div>
						{/* Footer Actions */}
						<DialogFooter className="flex items-center justify-end gap-3 p-6 ">
							<Button
								type="button"
								variant="secondary"
								onClick={() => handleOpenChange(false)}
								className="px-4 py-2 text-sm "
							>
								Cancel
							</Button>
							<Button
								type="submit"
								className="px-4 py-2 text-sm "
							>
								Create Project
							</Button>
						</DialogFooter>
					</form>
				</RadixForm>
			</DialogContent>
		</Dialog>
	);
}
