import { useState } from "react";

import { useProject } from "@/app/ProjectContext";
import { useApiKeyList } from "@/features/api-keys/data/listApiKeys";
import { Spinner } from "@/shared/ui/spinner";
import { ApiKeysList } from "@widgets/api-keys/ApiKeysList";
import { Plus } from "lucide-react";

import type { ApiKey, ApiKeyWithSecret } from "@entities/api-key/model/types";

import { ApiKeyCreatedDialog } from "@features/api-keys/ApiKeyCreatedDialog";
import { CreateApiKeyDialog } from "@features/api-keys/CreateApiKeyDialog";
import { RevokeApiKeyDialog } from "@features/api-keys/RevokeApiKeyDialog";

export function ProjectApiKeysPage() {
	const { currentProject } = useProject();

	const { data: apiKeysList, isPending: isLoadingKeysList } = useApiKeyList(
		currentProject?.id!,
	);

	const [showCreateDialog, setShowCreateDialog] = useState(false);
	const [showCreatedDialog, setShowCreatedDialog] = useState(false);
	const [showRevokeDialog, setShowRevokeDialog] = useState(false);
	const [createdKey, setCreatedKey] = useState<ApiKeyWithSecret | null>(null);
	const [selectedKey, setSelectedKey] = useState<ApiKey | null>(null);

	const handleCreateApiKey = (data: ApiKeyWithSecret) => {
		setCreatedKey(data);
		setShowCreatedDialog(true);
	};

	const handleRevokeClick = (apiKey: ApiKey) => {
		setSelectedKey(apiKey);
		setShowRevokeDialog(true);
	};

	const handleRevokeConfirm = () => {
		if (!selectedKey) return;

		// Close dialog and reset
		setShowRevokeDialog(false);
		setSelectedKey(null);
	};

	const handleRevokeCancel = () => {
		setShowRevokeDialog(false);
		setSelectedKey(null);
	};

	const handleCreatedDialogClose = () => {
		setShowCreatedDialog(false);
		setCreatedKey(null);
	};

	if (!currentProject) {
		return <div>Loading project...</div>;
	}

	return (
		<div className="p-8">
			{/* Header */}
			<div className="mb-6">
				<div className="flex items-center justify-between mb-2">
					<h1 className="text-2xl text-foreground">API Keys</h1>
					<button
						onClick={() => setShowCreateDialog(true)}
						className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
					>
						<Plus className="w-4 h-4" />
						Generate API Key
					</button>
				</div>
				<p className="text-sm text-muted-foreground">
					API keys allow you to authenticate requests to your
					project's queues and jobs. Keep your API keys secure and
					never share them publicly.
				</p>
			</div>

			{isLoadingKeysList && <Spinner size="lg" />}
			{/* API Keys List */}
			<ApiKeysList
				apiKeys={apiKeysList?.data.data.results || []}
				onRevoke={handleRevokeClick}
				onCreateClick={() => setShowCreateDialog(true)}
			/>

			{/* Dialogs */}
			<CreateApiKeyDialog
				open={showCreateDialog}
				onClose={() => setShowCreateDialog(false)}
				onSubmit={handleCreateApiKey}
				projectId={currentProject!.id}
			/>

			<ApiKeyCreatedDialog
				open={showCreatedDialog}
				onClose={handleCreatedDialogClose}
				apiKey={createdKey}
			/>

			<RevokeApiKeyDialog
				open={showRevokeDialog}
				onClose={handleRevokeCancel}
				onConfirm={handleRevokeConfirm}
				apiKey={selectedKey}
			/>
		</div>
	);
}
