import { Button } from "@/shared/ui/button";
import { Spinner } from "@/shared/ui/spinner";
import { formatDateTime } from "@/shared/utils/dateAndTimeUtils";
import { AlertTriangle } from "lucide-react";
import { toast } from "sonner";

import { Dialog, DialogContent } from "@shared/ui/dialog";

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
				<div className="p-6 space-y-4">
					<p className="text-sm text-neutral-700">
						Are you sure you want to revoke this API key?
					</p>

					<div className="space-y-3">
						<h4 className="text-sm text-neutral-900">
							Key Details
						</h4>
						<div className="space-y-2 text-sm">
							<div className="flex items-start justify-between">
								<span className="text-neutral-600">
									Created:
								</span>
								<span className="text-neutral-900">
									{formatDateTime(apiKey.createdAt)}
								</span>
							</div>
							<div className="flex items-start justify-between">
								<span className="text-neutral-600">
									Status:
								</span>
								<ApiKeyStatusBadge isRevoked={apiKey.revoked} />
							</div>
						</div>
					</div>

					{/* Warning */}
					<div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded">
						<AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
						<div>
							<p className="text-sm text-amber-900">
								This action cannot be undone. Any applications
								using this key will immediately lose access.
							</p>
						</div>
					</div>
				</div>

				{/* Footer */}
				<div className="flex items-center justify-end gap-3 p-6 border-t  sticky bottom-0 ">
					<Button
						type="button"
						onClick={onClose}
						className="px-4 py-2 text-sm text-neutral-700  rounded transition-colors"
					>
						Cancel
					</Button>
					<Button
						type="button"
						onClick={handleRevokeClick}
						className="px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
						disabled={isRevoking}
					>
						{isRevoking ? <Spinner /> : "Revoke Key"}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
