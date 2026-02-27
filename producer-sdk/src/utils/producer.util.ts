import { randomUUID } from "crypto";

export const generateProducerId = (label: string) => {
    return `${label}-${randomUUID()}`;
};
