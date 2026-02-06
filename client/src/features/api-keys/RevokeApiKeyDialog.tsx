import { AlertTriangle } from "lucide-react";
import { toast } from "sonner";

import { Alert, AlertDescription, AlertTitle } from "@shared/ui/alert";
import { Button } from "@shared/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@shared/ui/dialog";
import { Spinner } from "@shared/ui/spinner";
import { formatDateTime } from "@shared/utils/dateAndTimeUtils";

import { type ApiKey } from "@entities/api-key/model/types";
import { ApiKeyStatusBadge } from "@entities/api-key/ui/ApiKeyStatusBadge";

import {
	type RevokeApiKeyFormErrorHandler,
	useRevokeApiKeyForm,
} from "./data/revokeApiKeyForm";

type RevokeApiKeyDialogProps = {
	open: boolean;
	onClose: () => void;
	onConfirm: () => void;
	apiKey: ApiKey | null;
};

export function RevokeApiKeyDialog({
	open,
	onClose,
	onConfirm,
	apiKey,
}: RevokeApiKeyDialogProps) {
	const handleAPIKeyRevokeError: RevokeApiKeyFormErrorHandler = (message) => {
		if (message) {
			toast.error(message);
		}
	};

	const { mutate: revokeApiKey, isPending: isRevoking } = useRevokeApiKeyForm(
		handleAPIKeyRevokeError,
	);

	const handleRevokeClick = () => {
		if (!apiKey) return;

		revokeApiKey(
			{ apiKeyId: apiKey.id },
			{
				onSuccess() {
					toast.success("API Key revoked successfully.");
					onConfirm();
				},
			},
		);
	};

	if (!apiKey) {
		return null;
	}

	return (
		<Dialog open={open} onOpenChange={onClose}>
			<DialogContent
				title="Revoke API Key?"
				aria-describedby="revoke-api-key-description"
				showCloseButton={false}
			>
				<DialogTitle>Revoke API Key ?</DialogTitle>
				<div className="p-6 space-y-4">
					<p className="text-sm ">
						Are you sure you want to revoke this API key?
					</p>

					<div className="space-y-3">
						<h4 className="text-sm ">Key Details</h4>
						<div className="space-y-2 text-sm">
							<div className="flex items-start justify-between">
								<span>Created:</span>
								<span>{formatDateTime(apiKey.createdAt)}</span>
							</div>
							<div className="flex items-start justify-between">
								<span>Status:</span>
								<ApiKeyStatusBadge isRevoked={apiKey.revoked} />
							</div>
						</div>
					</div>

					<Alert variant="destructive">
						<AlertTitle className=" flex ">
							<AlertTriangle className="w-5 h-5  mr-2" />
							Warning
						</AlertTitle>
						<AlertDescription>
							This action cannot be undone. Any applications using
							this key will immediately lose access.
						</AlertDescription>
					</Alert>
				</div>

				<div className="flex items-center justify-end gap-3 p-6 border-t  sticky bottom-0 ">
					<Button type="button" variant="secondary" onClick={onClose}>
						Cancel
					</Button>
					<Button
						type="button"
						onClick={handleRevokeClick}
						variant="destructive"
						disabled={isRevoking}
					>
						{isRevoking ? <Spinner /> : "Revoke Key"}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
