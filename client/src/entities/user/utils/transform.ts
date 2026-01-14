import type { RawApiResponseUser, User } from "../types/user";

export const toUser = (data: RawApiResponseUser): User => {
	return {
		id: data.id,
		name: data.name,
		email: data.email,
		createdAt: data.created_at,
		updatedAt: data.updated_at,
	};
};

export const toUserList = (data: RawApiResponseUser[]): User[] => {
	return data.map((user) => toUser(user));
};
