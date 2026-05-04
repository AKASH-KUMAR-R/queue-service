import { PrismaClient, type User } from "@db/client";
import { enhance } from "@zenstack/enhance";

export const prisma = new PrismaClient(); // for non auth

export const getEnhancedPrisma = (user: Omit<User, "password">) => {
	return enhance(prisma, { user });
};
