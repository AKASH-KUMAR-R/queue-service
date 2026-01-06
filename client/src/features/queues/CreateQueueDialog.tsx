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
import { Textarea } from "../../shared/ui/form/Textarea";
import {
	RadixForm,
	RadixFormControl,
	RadixFormDescription,
	RadixFormField,
	RadixFormItem,
	RadixFormLabel,
	RadixFormMessage,
} from "../../shared/ui/radix-form";

const createQueueSchema = z.object({
	name: z
		.string()
		.min(1, "Queue name is required")
		.regex(
			/^[a-z0-9-]+$/,
			"Queue name must contain only lowercase letters, numbers, and hyphens",
		),
	description: z.string().optional(),
	rateLimit: z.number().min(1, "Rate limit must be at least 1"),
	rateLimitUnit: z.enum(["second", "minute", "hour"]),
	maxAttempts: z
		.number()
		.min(1, "Max attempts must be at least 1")
		.max(10, "Max attempts cannot exceed 10"),
	timeout: z.number().min(1, "Timeout must be at least 1 second"),
	retryDelay: z.number().min(0, "Retry delay cannot be negative"),
	priority: z
		.number()
		.min(1, "Priority must be at least 1")
		.max(10, "Priority cannot exceed 10"),
});

export type CreateQueueFormData = z.infer<typeof createQueueSchema>;

interface CreateQueueDialogProps {
	open: boolean;
	onClose: () => void;
	onSubmit: (data: CreateQueueFormData) => void;
}

export function CreateQueueDialog({
	open,
	onClose,
	onSubmit,
}: CreateQueueDialogProps) {
	const form = useForm<CreateQueueFormData>({
		resolver: zodResolver(createQueueSchema),
		defaultValues: {
			name: "",
			description: "",
			rateLimit: 100,
			rateLimitUnit: "minute",
			maxAttempts: 3,
			timeout: 30,
			retryDelay: 60,
			priority: 5,
		},
	});

	const { handleSubmit, control, reset, watch } = form;
	const formValues = watch();

	const handleFormSubmit = (data: CreateQueueFormData) => {
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
				title="Create New Queue"
				description="Configure a new job queue for processing tasks"
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
										name="name"
										render={({ field }) => (
											<RadixFormItem>
												<RadixFormLabel>
													Queue Name
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
											name="rateLimit"
											render={({ field }) => (
												<RadixFormItem>
													<RadixFormLabel>
														Rate Limit
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
											name="rateLimitUnit"
											render={({ field }) => (
												<RadixFormItem>
													<RadixFormLabel>
														Unit
													</RadixFormLabel>
													<Select
														onValueChange={
															field.onChange
														}
														defaultValue={
															field.value
														}
													>
														<RadixFormControl>
															<SelectTrigger>
																<SelectValue placeholder="Select a unit" />
															</SelectTrigger>
														</RadixFormControl>
														<SelectContent>
															<SelectItem value="second">
																per second
															</SelectItem>
															<SelectItem value="minute">
																per minute
															</SelectItem>
															<SelectItem value="hour">
																per hour
															</SelectItem>
														</SelectContent>
													</Select>
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

							{/* Job Configuration */}
							<div>
								<h3 className="text-base font-medium text-neutral-900 mb-4">
									Job Configuration
								</h3>
								<div className="grid grid-cols-12 gap-4">
									<div className="col-span-6">
										<RadixFormField
											control={control}
											name="maxAttempts"
											render={({ field }) => (
												<RadixFormItem>
													<RadixFormLabel>
														Max Attempts
													</RadixFormLabel>
													<RadixFormControl>
														<Input
															type="number"
															min="1"
															max="10"
															{...field}
															onChange={(e) =>
																field.onChange(
																	e.target
																		.valueAsNumber,
																)
															}
														/>
													</RadixFormControl>
													<RadixFormDescription>
														Number of retry attempts
													</RadixFormDescription>
													<RadixFormMessage />
												</RadixFormItem>
											)}
										/>
									</div>

									<div className="col-span-6">
										<RadixFormField
											control={control}
											name="priority"
											render={({ field }) => (
												<RadixFormItem>
													<RadixFormLabel>
														Default Priority
													</RadixFormLabel>
													<RadixFormControl>
														<Input
															type="number"
															min="1"
															max="10"
															{...field}
															onChange={(e) =>
																field.onChange(
																	e.target
																		.valueAsNumber,
																)
															}
														/>
													</RadixFormControl>
													<RadixFormDescription>
														1 (lowest) to 10
														(highest)
													</RadixFormDescription>
													<RadixFormMessage />
												</RadixFormItem>
											)}
										/>
									</div>

									<div className="col-span-6">
										<RadixFormField
											control={control}
											name="timeout"
											render={({ field }) => (
												<RadixFormItem>
													<RadixFormLabel>
														Timeout (seconds)
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
													<RadixFormDescription>
														Max execution time per
														job
													</RadixFormDescription>
													<RadixFormMessage />
												</RadixFormItem>
											)}
										/>
									</div>

									<div className="col-span-6">
										<RadixFormField
											control={control}
											name="retryDelay"
											render={({ field }) => (
												<RadixFormItem>
													<RadixFormLabel>
														Retry Delay (seconds)
													</RadixFormLabel>
													<RadixFormControl>
														<Input
															type="number"
															min="0"
															{...field}
															onChange={(e) =>
																field.onChange(
																	e.target
																		.valueAsNumber,
																)
															}
														/>
													</RadixFormControl>
													<RadixFormDescription>
														Delay before retry
														attempt
													</RadixFormDescription>
													<RadixFormMessage />
												</RadixFormItem>
											)}
										/>
									</div>
								</div>
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
											{formValues.rateLimit}/
											{formValues.rateLimitUnit}
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-neutral-600">
											Max Attempts:
										</span>
										<span className="font-mono text-neutral-900">
											{formValues.maxAttempts}
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-neutral-600">
											Timeout:
										</span>
										<span className="font-mono text-neutral-900">
											{formValues.timeout}s
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-neutral-600">
											Retry Delay:
										</span>
										<span className="font-mono text-neutral-900">
											{formValues.retryDelay}s
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-neutral-600">
											Priority:
										</span>
										<span className="font-mono text-neutral-900">
											{formValues.priority}
										</span>
									</div>
								</div>
							</div>
						</div>

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
								Create Queue
							</button>
						</div>
					</form>
				</RadixForm>
			</DialogContent>
		</Dialog>
	);
}
