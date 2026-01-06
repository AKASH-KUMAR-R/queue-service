import { useState } from "react";

import { ApiKeysList } from "@widgets/api-keys/ApiKeysList";
import { Plus } from "lucide-react";

import {
	generateMockApiKey,
	mockApiKeys,
} from "@entities/api-key/model/mockData";
import type {
	ApiKey,
	ApiKeyWithSecret,
	CreateApiKeyRequest,
} from "@entities/api-key/model/types";

import { ApiKeyCreatedDialog } from "@features/api-keys/ApiKeyCreatedDialog";
import { CreateApiKeyDialog } from "@features/api-keys/CreateApiKeyDialog";
import { RevokeApiKeyDialog } from "@features/api-keys/RevokeApiKeyDialog";

interface ProjectApiKeysPageProps {
	projectId: string;
}

export function ProjectApiKeysPage({ projectId }: ProjectApiKeysPageProps) {
	const [apiKeys, setApiKeys] = useState<ApiKey[]>(mockApiKeys);
	const [showCreateDialog, setShowCreateDialog] = useState(false);
	const [showCreatedDialog, setShowCreatedDialog] = useState(false);
	const [showRevokeDialog, setShowRevokeDialog] = useState(false);
	const [createdKey, setCreatedKey] = useState<ApiKeyWithSecret | null>(null);
	const [selectedKey, setSelectedKey] = useState<ApiKey | null>(null);

	const handleCreateApiKey = (data: CreateApiKeyRequest) => {
		// Generate mock API key
		const newKey = generateMockApiKey(data.name, data.description);

		// Add to list
		setApiKeys((prev) => [newKey, ...prev]);

		// Show created dialog with full key
		setCreatedKey(newKey);
		setShowCreatedDialog(true);
	};

	const handleRevokeClick = (apiKey: ApiKey) => {
		setSelectedKey(apiKey);
		setShowRevokeDialog(true);
	};

	const handleRevokeConfirm = () => {
		if (!selectedKey) return;

		// Update key status to revoked
		setApiKeys((prev) =>
			prev.map((key) =>
				key.id === selectedKey.id
					? {
							...key,
							status: "revoked" as const,
							revokedAt: new Date().toISOString(),
						}
					: key,
			),
		);

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

			{/* API Keys List */}
			<ApiKeysList
				apiKeys={apiKeys}
				onRevoke={handleRevokeClick}
				onCreateClick={() => setShowCreateDialog(true)}
			/>

			{/* Dialogs */}
			<CreateApiKeyDialog
				open={showCreateDialog}
				onClose={() => setShowCreateDialog(false)}
				onSubmit={handleCreateApiKey}
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
