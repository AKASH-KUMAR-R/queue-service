import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

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
import { Spinner } from "@shared/ui/spinner";
import { Switch } from "@shared/ui/switch";
import { mapServerFieldErrorToFormFields } from "@shared/utils/formUtils";

import {
	type CreateEnvironmentFormData,
	createEnvironmentSchema,
} from "@entities/environment/schema/environmentSchema";
import type { Environment } from "@entities/environment/types/types";
import { toCreateEnvironmentRequest } from "@entities/environment/utils/transform";

import {
	type EnvironmentCreateFormErrorHandler,
	useEnvironmentCreate,
} from "../data/environmentCreateForm";

type CreateEnvironmentDialogProps = {
	open: boolean;
	projectId: string;
	onClose: () => void;
	onSubmit: (environment: Environment) => void;
};

export function CreateEnvironmentDialog({
	open,
	projectId,
	onClose,
	onSubmit,
}: CreateEnvironmentDialogProps) {
	const form = useForm<CreateEnvironmentFormData>({
		resolver: zodResolver(createEnvironmentSchema),
		defaultValues: {
			projectId,
			name: "",
			isDefault: false,
		},
	});

	const { handleSubmit, control, reset } = form;

	const handleFormErrors: EnvironmentCreateFormErrorHandler = (
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

	const { mutate: createEnvironment, isPending } =
		useEnvironmentCreate(handleFormErrors);

	const handleFormSubmit = (data: CreateEnvironmentFormData) => {
		createEnvironment(toCreateEnvironmentRequest(data), {
			onSuccess: (newEnvironment) => {
				toast.success("Environment created successfully");
				onSubmit(newEnvironment.data);
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
				title="Create Environment"
				aria-describedby="create-environment-description"
			>
				<DialogHeader>
					<DialogTitle>Create Environment</DialogTitle>
				</DialogHeader>

				<RadixForm {...form}>
					<form onSubmit={handleSubmit(handleFormSubmit)}>
						<div className="p-6 space-y-4">
							<RadixFormField
								control={control}
								name="name"
								render={({ field }) => (
									<RadixFormItem>
										<RadixFormLabel>
											Environment Name
										</RadixFormLabel>
										<RadixFormControl>
											<Input
												placeholder="staging"
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
								name="isDefault"
								render={({ field }) => (
									<RadixFormItem className="flex items-center justify-between rounded-md border p-4">
										<div className="space-y-1">
											<RadixFormLabel>
												Default Environment
											</RadixFormLabel>
											<RadixFormDescription>
												Use this environment as the
												default for the current project.
											</RadixFormDescription>
										</div>
										<RadixFormControl>
											<Switch
												checked={field.value || false}
												onCheckedChange={field.onChange}
											/>
										</RadixFormControl>
									</RadixFormItem>
								)}
							/>
						</div>

						<DialogFooter className="flex items-center justify-end gap-3 p-6">
							<Button
								type="button"
								variant="secondary"
								onClick={() => handleOpenChange(false)}
							>
								Cancel
							</Button>
							<Button type="submit" disabled={isPending}>
								{isPending ? <Spinner /> : "Create"}
							</Button>
						</DialogFooter>
					</form>
				</RadixForm>
			</DialogContent>
		</Dialog>
	);
}
