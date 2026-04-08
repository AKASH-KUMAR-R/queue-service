import type { PrismaClient } from "@db/client";

type DelegateForModel<M extends keyof PrismaClient> =
	PrismaClient[M] extends infer D ? D : never;

export type ModelName = {
	[K in keyof PrismaClient]: DelegateForModel<K> extends { update: any }
		? K
		: never;
}[keyof PrismaClient];
