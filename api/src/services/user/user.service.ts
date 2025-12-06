import type { PrismaClient } from "@prisma/client";

const createUser = async (db: PrismaClient, data: any) => {
	const user = await db.user.create({
		data,
	});
	return user;
};

const findUserById = async (db: PrismaClient, id: string) => {
	const user = await db.user.findUnique({
		where: { id },
	});
	return user;
};

export default {
	createUser,
	findUserById,
};
