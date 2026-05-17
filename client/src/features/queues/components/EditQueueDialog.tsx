import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@shared/ui/button";
import { Dialog, DialogContent } from "@shared/ui/dialog";
import { Input } from "@shared/ui/input";
import {
	RadixForm,
	RadixFormControl,
	RadixFormField,
	RadixFormItem,
	RadixFormLabel,
	RadixFormMessage,
} from "@shared/ui/radix-form";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@shared/ui/select";
import { Spinner } from "@shared/ui/spinner";
import { Textarea } from "@shared/ui/textarea";
import { mapServerFieldErrorToFormFields } from "@shared/utils/formUtils";

import {
	QueueUpdateSchema,
	type QueueUpdateSchemaType,
} from "@entities/queue/schema/queueSchema";
import type { Queue, QueueStatus } from "@entities/queue/types/types";
import { toUpdateQueueRequest } from "@entities/queue/utils/transform";

import {
	type QueueUpdateFormErrorHandler,
	useQueueUpdate,
} from "../data/queueUpdateForm";

type EditQueueDialogProps = {
	queue: Queue | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
};

const DEFAULT_FORM_VALUES: QueueUpdateSchemaType = {
	label: "",
	description: "",
	status: "ACTIVE",
	rateLimitCount: 1,
	rateLimitWindowMs: 1,
};

const getQueueFormValues = (queue: Queue | null): QueueUpdateSchemaType => {
	if (!queue) return DEFAULT_FORM_VALUES;

	return {
		label: queue.label,
		description: queue.description || "",
		status: queue.status,
		rateLimitCount: queue.rateLimitCount || 1,
		rateLimitWindowMs: queue.rateLimitWindowMs || 1,
	};
};

const statusLabels: Record<QueueStatus, string> = {
	ACTIVE: "Active",
	PAUSED: "Paused",
	DELETED: "Deleted",
};

export function EditQueueDialog({
	queue,
	open,
	onOpenChange,
}: EditQueueDialogProps) {
	const form = useForm<QueueUpdateSchemaType>({
		resolver: zodResolver(QueueUpdateSchema),
		defaultValues: getQueueFormValues(queue),
	});

	const { handleSubmit, control, reset } = form;

	useEffect(() => {
		if (!open) return;
		reset(getQueueFormValues(queue));
	}, [open, queue, reset]);

	const handleFormErrors: QueueUpdateFormErrorHandler = (message, errors) => {
		if (message) {
			toast.error(message);
		}

		if (errors) {
			mapServerFieldErrorToFormFields(form.setError, errors);
		}
	};

	const { mutate: updateQueue, isPending } = useQueueUpdate(handleFormErrors);

	const handleSubmitForm = (data: QueueUpdateSchemaType) => {
		if (!queue) return;

		const changedData: Partial<QueueUpdateSchemaType> = {};

		if (data.label !== queue.label) changedData.label = data.label;
		if ((data.description || "") !== (queue.description || "")) {
			changedData.description = data.description;
		}
		if (data.status !== queue.status) changedData.status = data.status;
		if (data.rateLimitCount !== (queue.rateLimitCount || 1)) {
			changedData.rateLimitCount = data.rateLimitCount;
		}
		if (data.rateLimitWindowMs !== (queue.rateLimitWindowMs || 1)) {
			changedData.rateLimitWindowMs = data.rateLimitWindowMs;
		}

		if (Object.keys(changedData).length === 0) {
			toast.info("No changes to save");
			return;
		}

		updateQueue(
			{
				queueId: queue.id,
				data: toUpdateQueueRequest(changedData),
			},
			{
				onSuccess: () => {
					toast.success("Queue updated successfully");
					onOpenChange(false);
				},
			},
		);
	};

	const handleDialogChange = (isOpen: boolean) => {
		if (!isOpen) {
			reset(getQueueFormValues(queue));
		}

		onOpenChange(isOpen);
	};

	return (
		<Dialog open={open} onOpenChange={handleDialogChange}>
			<DialogContent
				className="w-full max-w-lg"
				title="Edit Queue"
				aria-describedby="edit-queue-description"
				showCloseButton={false}
			>
				<RadixForm {...form}>
					<form onSubmit={handleSubmit(handleSubmitForm)}>
						<div className="p-6 space-y-4">
							<RadixFormField
								control={control}
								name="label"
								render={({ field }) => (
									<RadixFormItem>
										<RadixFormLabel>Queue Label</RadixFormLabel>
										<RadixFormControl>
											<Input {...field} />
										</RadixFormControl>
										<RadixFormMessage />
									</RadixFormItem>
								)}
							/>

							<RadixFormField
								control={control}
								name="description"
								render={({ field }) => (
									<RadixFormItem>
										<RadixFormLabel>Description</RadixFormLabel>
										<RadixFormControl>
											<Textarea rows={3} {...field} />
										</RadixFormControl>
										<RadixFormMessage />
									</RadixFormItem>
								)}
							/>

							<RadixFormField
								control={control}
								name="status"
								render={({ field }) => (
									<RadixFormItem>
										<RadixFormLabel>Status</RadixFormLabel>
										<RadixFormControl>
											<Select
												value={field.value}
												onValueChange={field.onChange}
											>
												<SelectTrigger>
													<SelectValue />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="ACTIVE">
														{statusLabels.ACTIVE}
													</SelectItem>
													<SelectItem value="PAUSED">
														{statusLabels.PAUSED}
													</SelectItem>
													<SelectItem value="DELETED">
														{statusLabels.DELETED}
													</SelectItem>
												</SelectContent>
											</Select>
										</RadixFormControl>
										<RadixFormMessage />
									</RadixFormItem>
								)}
							/>

							<div className="grid grid-cols-12 gap-4">
								<div className="col-span-6">
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
														onChange={(event) => {
															field.onChange(
																event.target
																	.valueAsNumber,
															);
														}}
													/>
												</RadixFormControl>
												<RadixFormMessage />
											</RadixFormItem>
										)}
									/>
								</div>
								<div className="col-span-6">
									<RadixFormField
										control={control}
										name="rateLimitWindowMs"
										render={({ field }) => (
											<RadixFormItem>
												<RadixFormLabel>
													Rate Limit Unit( in ms)
												</RadixFormLabel>
												<RadixFormControl>
													<Input
														type="number"
														min="1"
														{...field}
														onChange={(event) => {
															field.onChange(
																event.target
																	.valueAsNumber,
															);
														}}
													/>
												</RadixFormControl>
												<RadixFormMessage />
											</RadixFormItem>
										)}
									/>
								</div>
							</div>
						</div>

						<div className="flex items-center justify-end gap-3 p-6 border-t">
							<Button
								type="button"
								variant="secondary"
								onClick={() => handleDialogChange(false)}
							>
								Cancel
							</Button>
							<Button type="submit" disabled={isPending}>
								{isPending ? <Spinner /> : "Save Changes"}
							</Button>
						</div>
					</form>
				</RadixForm>
			</DialogContent>
		</Dialog>
	);
}
