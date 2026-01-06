import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { type CreateApiKeyRequest } from "../../entities/api-key/model/types";
import { Dialog, DialogContent } from "../../shared/ui/Dialog";
import { Input } from "../../shared/ui/form/Input";
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

const createApiKeySchema = z.object({
	name: z
		.string()
		.min(1, "API key name is required")
		.max(100, "Name cannot exceed 100 characters"),
	description: z
		.string()
		.max(500, "Description cannot exceed 500 characters")
		.optional(),
});

type CreateApiKeyFormData = z.infer<typeof createApiKeySchema>;

interface CreateApiKeyDialogProps {
	open: boolean;
	onClose: () => void;
	onSubmit: (data: CreateApiKeyRequest) => void;
}

export function CreateApiKeyDialog({
	open,
	onClose,
	onSubmit,
}: CreateApiKeyDialogProps) {
	const form = useForm<CreateApiKeyFormData>({
		resolver: zodResolver(createApiKeySchema),
		defaultValues: {
			name: "",
			description: "",
		},
	});

	const { handleSubmit, control, reset } = form;

	const handleFormSubmit = (data: CreateApiKeyFormData) => {
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
				title="Generate API Key"
				description="Create a new API key for authenticating requests to this project"
				aria-describedby="create-api-key-description"
			>
				<RadixForm {...form}>
					<form onSubmit={handleSubmit(handleFormSubmit)}>
						<div className="p-6 space-y-4">
							<RadixFormField
								control={control}
								name="name"
								render={({ field }) => (
									<RadixFormItem>
										<RadixFormLabel>
											API Key Name
										</RadixFormLabel>
										<RadixFormControl>
											<Input
												placeholder="Production Backend Server"
												{...field}
											/>
										</RadixFormControl>
										<RadixFormDescription>
											A descriptive name to identify this
											key
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
												placeholder="Used for production job queue operations"
												rows={3}
												{...field}
											/>
										</RadixFormControl>
										<RadixFormDescription>
											Optional notes about this key's
											purpose
										</RadixFormDescription>
										<RadixFormMessage />
									</RadixFormItem>
								)}
							/>
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
								Generate API Key
							</button>
						</div>
					</form>
				</RadixForm>
			</DialogContent>
		</Dialog>
	);
}
