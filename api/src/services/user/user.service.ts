import type { Prisma, PrismaClient, User } from "@prisma/client";

const createUser = async (db: PrismaClient, data: Prisma.UserCreateInput) => {
	const user = await db.user.create({
		data,
		omit: {
			password: true,
		},
	});
	return user;
};

const findUserById = async (db: PrismaClient, id: string) => {
	const user = await db.user.findUnique({
		where: { id },
		omit: {
			password: true,
		},
	});
	return user;
};

const findUserByEmailWithPassword = async (db: PrismaClient, email: string) => {
	const user = await db.user.findUnique({
		where: { email },
	});
	return user;
};

const findUserByEmail = async (db: PrismaClient, email: string) => {
	const user = await db.user.findUnique({
		where: { email },
		omit: {
			password: true,
		},
	});
	return user;
};

export default {
	createUser,
	findUserById,
	findUserByEmail,
	findUserByEmailWithPassword,
};
