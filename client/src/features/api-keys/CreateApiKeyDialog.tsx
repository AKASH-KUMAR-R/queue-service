import { toast } from "sonner";

import { Button } from "@shared/ui/button";
import { Spinner } from "@shared/ui/spinner";

import { type ApiKeyWithSecret } from "../../entities/api-key/model/types";
import { Dialog, DialogContent } from "../../shared/ui/dialog";
import {
	type CreateApiKeyFormErrorHandler,
	useCreateApiKeyForm,
} from "./data/createApiKeyForm";

interface CreateApiKeyDialogProps {
	open: boolean;
	onClose: () => void;
	onSubmit: (data: ApiKeyWithSecret) => void;
	projectId: string;
}

export function CreateApiKeyDialog({
	open,
	onClose,
	onSubmit,
	projectId,
}: CreateApiKeyDialogProps) {
	const handleCreateApiKeyError: CreateApiKeyFormErrorHandler = (
		message,
		errors,
	) => {
		if (message) {
			toast.error(message);
		}

		if (errors) {
			toast.info("Please check the form for errors.");
		}
	};
	const { mutate: createApiKey, isPending: isApiKeyCreating } =
		useCreateApiKeyForm(handleCreateApiKeyError);

	const handleApiGenerateClick = () => {
		createApiKey(
			{ project_id: projectId },
			{
				onSuccess({ data: resData }) {
					toast.success("API Key created successfully.");
					onSubmit(resData);
					onClose();
				},
			},
		);
	};

	const handleOpenChange = (isOpen: boolean) => {
		if (!isOpen) {
			// reset();
			onClose();
		}
	};

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogContent
				title="Generate API Key"
				aria-describedby="create-api-key-description"
				showCloseButton={false}
			>
				<div className="flex items-center justify-end gap-3 p-6 border-t  sticky bottom-0 ">
					<Button
						type="button"
						onClick={() => handleOpenChange(false)}
						className="px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 rounded transition-colors"
					>
						Cancel
					</Button>
					<Button
						type="button"
						onClick={handleApiGenerateClick}
						className="px-4 py-2 text-sm bg-neutral-900 text-white rounded hover:bg-neutral-800 transition-colors"
						disabled={isApiKeyCreating}
					>
						{isApiKeyCreating ? <Spinner /> : "Generate API Key"}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
