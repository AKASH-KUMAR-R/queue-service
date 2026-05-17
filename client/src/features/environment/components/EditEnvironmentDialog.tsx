import { useEffect } from "react";
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
	type UpdateEnvironmentFormData,
	updateEnvironmentSchema,
} from "@entities/environment/schema/environmentSchema";
import type { Environment } from "@entities/environment/types/types";
import { toUpdateEnvironmentRequest } from "@entities/environment/utils/transform";

import {
	type EnvironmentUpdateFormErrorHandler,
	useEnvironmentUpdate,
} from "../data/environmentUpdateForm";

type EditEnvironmentDialogProps = {
	open: boolean;
	environment: Environment | null;
	onClose: () => void;
	onSubmit: (environment: Environment) => void;
};

export function EditEnvironmentDialog({
	open,
	environment,
	onClose,
	onSubmit,
}: EditEnvironmentDialogProps) {
	const form = useForm<UpdateEnvironmentFormData>({
		resolver: zodResolver(updateEnvironmentSchema),
		defaultValues: {
			name: environment?.name || "",
			isDefault: environment?.isDefault || false,
		},
	});

	const { handleSubmit, control, reset } = form;

	useEffect(() => {
		reset({
			name: environment?.name || "",
			isDefault: environment?.isDefault || false,
		});
	}, [environment, reset]);

	const handleFormErrors: EnvironmentUpdateFormErrorHandler = (
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

	const { mutate: updateEnvironment, isPending } =
		useEnvironmentUpdate(handleFormErrors);

	const handleFormSubmit = (data: UpdateEnvironmentFormData) => {
		if (!environment) return;

		updateEnvironment(
			{
				environmentId: environment.id,
				data: toUpdateEnvironmentRequest(data),
			},
			{
				onSuccess: (updatedEnvironment) => {
					toast.success("Environment updated successfully");
					onSubmit(updatedEnvironment.data);
					onClose();
				},
			},
		);
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
				title="Edit Environment"
				aria-describedby="edit-environment-description"
			>
				<DialogHeader>
					<DialogTitle>Edit Environment</DialogTitle>
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
											<Input {...field} />
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
								{isPending ? <Spinner /> : "Save Changes"}
							</Button>
						</DialogFooter>
					</form>
				</RadixForm>
			</DialogContent>
		</Dialog>
	);
}
