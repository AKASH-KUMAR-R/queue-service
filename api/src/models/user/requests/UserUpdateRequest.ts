import zod from "zod";

const UserUpdateRequest = zod
	.object({
		name: zod.string().min(1).max(100).optional(),
		email: zod.email().optional(),
	})
	.strip();

export { UserUpdateRequest };

export type UserUpdateRequestType = zod.infer<typeof UserUpdateRequest>;
