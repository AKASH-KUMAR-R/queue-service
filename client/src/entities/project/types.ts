export type Project = {
	id: string;
	label: string;
	description: string;
	userId: string;
	createdAt: string;
	updatedAt: string;
};

export type RawApiResponseProject = {
	id: string;
	label: string;
	description: string;
	user_id: string;
	created_at: string;
	updated_at: string;
};
