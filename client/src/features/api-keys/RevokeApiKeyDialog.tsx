import { AlertTriangle } from "lucide-react";

import { type ApiKey } from "../../entities/api-key/model/types";
import { ApiKeyDisplay } from "../../entities/api-key/ui/ApiKeyDisplay";
import { Dialog, DialogContent } from "../../shared/ui/Dialog";

interface RevokeApiKeyDialogProps {
	open: boolean;
	onClose: () => void;
	onConfirm: () => void;
	apiKey: ApiKey | null;
}

export function RevokeApiKeyDialog({
	open,
	onClose,
	onConfirm,
	apiKey,
}: RevokeApiKeyDialogProps) {
	if (!apiKey) return null;

	return (
		<Dialog open={open} onOpenChange={onClose}>
			<DialogContent
				title="Revoke API Key?"
				description="This action cannot be undone and will immediately revoke access"
				aria-describedby="revoke-api-key-description"
			>
				<div className="p-6 space-y-4">
					<p className="text-sm text-neutral-700">
						Are you sure you want to revoke this API key?
					</p>

					{/* Key Info */}
					<div className="p-3 bg-neutral-50 border border-neutral-200 rounded space-y-2">
						<div className="text-sm text-neutral-900">
							{apiKey.name}
						</div>
						<ApiKeyDisplay
							prefix={apiKey.prefix}
							suffix={apiKey.suffix}
						/>
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
				<div className="flex items-center justify-end gap-3 p-6 border-t border-neutral-200 sticky bottom-0 bg-white">
					<button
						onClick={onClose}
						className="px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 rounded transition-colors"
					>
						Cancel
					</button>
					<button
						onClick={onConfirm}
						className="px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
					>
						Revoke Key
					</button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
