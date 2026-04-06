import { useState } from "react";
import { useSearchParams } from "react-router-dom";

import { useProject } from "@app/ProjectContext";
import { ApiKeysList } from "@widgets/api-keys/ApiKeysList";
import { Plus } from "lucide-react";

import { Button } from "@shared/ui/button";

import type { ApiKey, ApiKeyWithSecret } from "@entities/api-key/model/types";

import { ApiKeyCreatedDialog } from "@features/api-keys/ApiKeyCreatedDialog";
import { CreateApiKeyDialog } from "@features/api-keys/CreateApiKeyDialog";
import { RevokeApiKeyDialog } from "@features/api-keys/RevokeApiKeyDialog";
import { useApiKeyList } from "@features/api-keys/data/listApiKeys";

//INFO The ProjectExistenceWrapper ensures that this page is only rendered if a project is selected, so we can safely assume currentProject is always defined here.
export function ProjectApiKeysPage() {
	const { currentProject } = useProject();

	const [searchQuery, setSearchQuery] = useSearchParams();
	const { data: apiKeysList, isPending: isLoadingKeysList } = useApiKeyList(
		currentProject!.id,
		{
			page: Number(searchQuery.get("page")) || 1,
			limit: 10,
		},
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

	const handlePageChange = (newPage: number) => {
		setSearchQuery((prev) => {
			const newParams = new URLSearchParams(prev);
			newParams.set("page", newPage.toString());
			return newParams;
		});
	};

	return (
		<div className="p-8">
			{/* Header */}
			<div className="mb-6">
				<div className="flex items-center justify-between mb-2">
					<h1 className="text-2xl text-foreground">API Keys</h1>
					<Button onClick={() => setShowCreateDialog(true)}>
						<Plus className="w-4 h-4" />
						Generate API Key
					</Button>
				</div>
				<p className="text-sm text-muted-foreground">
					API keys allow you to authenticate requests to your
					project's queues and jobs. Keep your API keys secure and
					never share them publicly.
				</p>
			</div>

			{/* API Keys List */}
			<ApiKeysList
				apiKeys={apiKeysList?.data.results || []}
				onRevoke={handleRevokeClick}
				onCreateClick={() => setShowCreateDialog(true)}
				page={Number(searchQuery.get("page")) || 1}
				onPageChange={handlePageChange}
				totalPages={apiKeysList?.data.totalPages || 1}
				loading={isLoadingKeysList}
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
