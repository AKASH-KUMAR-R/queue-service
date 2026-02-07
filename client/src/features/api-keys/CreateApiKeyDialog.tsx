import React, { useState } from "react";

import { toast } from "sonner";

import { Button } from "@shared/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@shared/ui/dialog";
import { Label } from "@shared/ui/label";
import { Spinner } from "@shared/ui/spinner";
import { Textarea } from "@shared/ui/textarea";

import { type ApiKeyWithSecret } from "@entities/api-key/model/types";

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
	const [description, setDescription] = useState("");

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

	const handleApiGenerateClick = (
		event: React.FormEvent<HTMLFormElement>,
	) => {
		event.preventDefault();
		createApiKey(
			{ project_id: projectId, description },
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
			setDescription("");
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
				<DialogTitle>
					Generate a new API Key for your project
				</DialogTitle>

				<form onSubmit={handleApiGenerateClick}>
					<div className=" space-y-2">
						<Label htmlFor="api-description">Description</Label>
						<Textarea
							id="api-description"
							className=" w-full min-h-20"
							value={description}
							onChange={(event) =>
								setDescription(event.target.value)
							}
							placeholder="A brief description to identify this API key (e.g., 'Key for backend service')"
						/>
					</div>

					<div className="flex items-center justify-end gap-3 p-6 border-t  sticky bottom-0 ">
						<Button
							type="button"
							onClick={() => handleOpenChange(false)}
							variant="secondary"
						>
							Cancel
						</Button>
						<Button type="submit" disabled={isApiKeyCreating}>
							{isApiKeyCreating ? (
								<Spinner />
							) : (
								"Generate API Key"
							)}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
