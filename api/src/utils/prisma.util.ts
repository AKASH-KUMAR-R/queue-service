import { PrismaClient, type User } from "@prisma/client";
import { enhance } from "@zenstackhq/runtime";

export const prisma = new PrismaClient(); // for non auth

export const getEnhancedPrisma = (user: User) => {
	return enhance(prisma, { user });
};
