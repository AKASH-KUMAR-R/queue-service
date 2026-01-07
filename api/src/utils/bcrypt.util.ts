import bcrypt from "bcryptjs";

const SALT_ROUNDS = 12;

export const compareText = async (compareText: string, hashedText: string) => {
	return await bcrypt.compare(compareText, hashedText);
};

export const hashText = async (plainText: string): Promise<string> => {
	const hashedText = await bcrypt.hash(plainText, SALT_ROUNDS);
	return hashedText;
};
