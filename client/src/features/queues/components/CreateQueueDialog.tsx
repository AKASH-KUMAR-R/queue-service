import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@shared/ui/button";
import { Dialog, DialogContent } from "@shared/ui/dialog";
import { Input } from "@shared/ui/form/Input";
import { Textarea } from "@shared/ui/form/Textarea";
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
import { mapServerFieldErrorToFormFields } from "@shared/utils/formUtils";

import {
	QueueCreateSchema,
	type QueueCreateSchemaType,
} from "@entities/queue/schema/queueSchema";
import type { Queue } from "@entities/queue/types/types";
import { toCreateQueueRequest } from "@entities/queue/utils/transform";

import {
	type QueueCreateFormErrorHandler,
	useQueueCreate,
} from "../data/queueCreateForm";

type CreateQueueDialogProps = {
	open: boolean;
	projectId: string;
	onClose: () => void;
	onSubmit: (data: Queue) => void;
};

export function CreateQueueDialog({
	open,
	onClose,
	projectId,
	onSubmit,
}: CreateQueueDialogProps) {
	const form = useForm<QueueCreateSchemaType>({
		resolver: zodResolver(QueueCreateSchema),
		defaultValues: {
			label: "",
			description: "",
			projectId,
			rateLimitCount: undefined,
			rateLimitWindowMs: undefined,
		},
	});

	const { handleSubmit, control, reset, watch } = form;
	const formValues = watch();

	const handleFormErrors: QueueCreateFormErrorHandler = (message, errors) => {
		if (message) {
			toast.error(message);
		}

		if (errors) {
			mapServerFieldErrorToFormFields(form.setError, errors);
		}
	};

	const { mutate: createQueue, isPending: isCreating } =
		useQueueCreate(handleFormErrors);

	const handleFormSubmit = (data: QueueCreateSchemaType) => {
		createQueue(toCreateQueueRequest(data), {
			onSuccess: (newQueue) => {
				onSubmit(newQueue.data);
				reset();
				onClose();
				toast.success("Queue created successfully");
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
				title="Create New Queue"
				aria-describedby="create-queue-description"
			>
				<RadixForm {...form}>
					<form onSubmit={handleSubmit(handleFormSubmit)}>
						<div className="p-6 space-y-6">
							{/* Basic Information */}
							<div>
								<h3 className="text-base font-medium text-neutral-900 mb-4">
									Basic Information
								</h3>
								<div className="space-y-4">
									<RadixFormField
										control={control}
										name="label"
										render={({ field }) => (
											<RadixFormItem>
												<RadixFormLabel>
													Queue Label
												</RadixFormLabel>
												<RadixFormControl>
													<Input
														placeholder="email-notifications"
														{...field}
													/>
												</RadixFormControl>
												<RadixFormDescription>
													Use lowercase letters,
													numbers, and hyphens only
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
													Description
												</RadixFormLabel>
												<RadixFormControl>
													<Textarea
														placeholder="Processes email notification jobs for user events"
														rows={3}
														{...field}
													/>
												</RadixFormControl>
												<RadixFormMessage />
											</RadixFormItem>
										)}
									/>
								</div>
							</div>

							{/* Rate Limiting */}
							<div>
								<h3 className="text-base font-medium text-neutral-900 mb-4">
									Rate Limiting
								</h3>
								<div className="grid grid-cols-12 gap-4">
									<div className="col-span-8">
										<RadixFormField
											control={control}
											name="rateLimitCount"
											render={({ field }) => (
												<RadixFormItem>
													<RadixFormLabel>
														Rate Limit Count
													</RadixFormLabel>
													<RadixFormControl>
														<Input
															type="number"
															min="1"
															{...field}
															onChange={(e) =>
																field.onChange(
																	e.target
																		.valueAsNumber,
																)
															}
														/>
													</RadixFormControl>
													<RadixFormMessage />
												</RadixFormItem>
											)}
										/>
									</div>
									<div className="col-span-4">
										<RadixFormField
											control={control}
											name="rateLimitWindowMs"
											render={({ field }) => (
												<RadixFormItem>
													<RadixFormLabel>
														Rate Limit Unit
													</RadixFormLabel>
													<RadixFormControl>
														<Input {...field} />
													</RadixFormControl>
													<RadixFormMessage />
												</RadixFormItem>
											)}
										/>
									</div>
								</div>
								<p className="text-xs text-neutral-500 mt-2">
									Maximum number of jobs to process per time
									unit
								</p>
							</div>

							{/* Summary */}
							<div className="bg-neutral-50 border border-neutral-200 rounded p-4">
								<h4 className="text-sm font-medium text-neutral-900 mb-3">
									Configuration Summary
								</h4>
								<div className="grid grid-cols-2 gap-x-8 gap-y-2 text-xs">
									<div className="flex justify-between">
										<span className="text-neutral-600">
											Rate Limit:
										</span>
										<span className="font-mono text-neutral-900">
											{formValues.rateLimitCount}/
											{formValues.rateLimitWindowMs}
										</span>
									</div>
								</div>
							</div>
						</div>

						<div className="flex items-center justify-end gap-3 p-6 border-t border-neutral-200 sticky bottom-0 bg-white">
							<Button
								type="button"
								onClick={() => handleOpenChange(false)}
								className="px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 rounded transition-colors"
							>
								Cancel
							</Button>
							<Button
								type="submit"
								className="px-4 py-2 text-sm bg-neutral-900 text-white rounded hover:bg-neutral-800 transition-colors"
								disabled={isCreating}
							>
								{isCreating ? <Spinner /> : "Create Queue"}
							</Button>
						</div>
					</form>
				</RadixForm>
			</DialogContent>
		</Dialog>
	);
}
