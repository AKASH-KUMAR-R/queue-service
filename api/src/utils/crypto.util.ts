import crypto from "crypto";

export const createToken = (length: number = 32) => {
	return crypto.randomBytes(length).toString("hex");
};

export const hashToken = (token: string) => {
	return crypto.createHash("sha256").update(token).digest("hex");
};
