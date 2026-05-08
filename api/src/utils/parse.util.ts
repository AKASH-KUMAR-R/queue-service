import type { Prisma } from "@db/client";

export const toNullableNumber = (
	value: number | string | Prisma.Decimal | null | undefined,
) => {
	if (value == null) {
		return null;
	}

	if (typeof value === "number") {
		return value;
	}

	if (typeof value === "string") {
		return Number(value);
	}

	return value.toNumber();
};
