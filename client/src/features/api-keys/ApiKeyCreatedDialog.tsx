import { AlertTriangle } from "lucide-react";

import { formatDateTime } from "@shared/utils/dateAndTimeUtils";

import { type ApiKeyWithSecret } from "../../entities/api-key/model/types";
import { ApiKeyDisplay } from "../../entities/api-key/ui/ApiKeyDisplay";
import { ApiKeyStatusBadge } from "../../entities/api-key/ui/ApiKeyStatusBadge";
import { Dialog, DialogContent } from "../../shared/ui/dialog";

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
				aria-describedby="api-key-created-description"
			>
				<div className="p-6 space-y-6">
					{/* Warning Banner */}
					<div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded">
						<AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
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
					<button
						onClick={onClose}
						className="px-4 py-2 text-sm bg-neutral-900 text-white rounded hover:bg-neutral-800 transition-colors"
					>
						I've copied my key
					</button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
