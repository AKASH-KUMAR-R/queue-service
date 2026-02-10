import { AlertTriangle } from "lucide-react";

import { Button } from "@shared/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@shared/ui/dialog";
import { formatDateTime } from "@shared/utils/dateAndTimeUtils";

import { type ApiKeyWithSecret } from "../../entities/api-key/model/types";
import { ApiKeyDisplay } from "../../entities/api-key/ui/ApiKeyDisplay";
import { ApiKeyStatusBadge } from "../../entities/api-key/ui/ApiKeyStatusBadge";

interface ApiKeyCreatedDialogProps {
	open: boolean;
	onClose: () => void;
	apiKey: ApiKeyWithSecret | null;
}

export function ApiKeyCreatedDialog({
	open,
	onClose,
	apiKey,
}: ApiKeyCreatedDialogProps) {
	if (!apiKey) return null;

	return (
		<Dialog open={open} onOpenChange={onClose}>
			<DialogContent
				title="API Key Created Successfully"
				className="max-w-lg"
			>
				<DialogTitle>API Key Created Successfully</DialogTitle>
				<div className="p-6 space-y-6">
					{/* Warning Banner */}
					<div className="flex items-start gap-3 p-4 rounded">
						<AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
						<div>
							<p className="text-sm text-amber-900">
								<strong>
									Make sure to copy your API key now.
								</strong>{" "}
								You won't be able to see it again!
							</p>
						</div>
					</div>

					{/* API Key Display */}
					<div>
						<label className="block text-sm text-neutral-700 mb-2">
							Your API Key
						</label>
						<ApiKeyDisplay
							fullKey={apiKey.unhashedKey}
							showCopyButton={true}
						/>
					</div>

					{/* Key Details */}
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
				</div>

				{/* Footer */}
				<div className="flex items-center justify-end p-6 border-t border-neutral-200 sticky bottom-0 bg-white">
					<Button onClick={onClose}>I've copied my key</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
