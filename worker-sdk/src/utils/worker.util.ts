import { randomUUID } from "crypto";

export const generateWorkerId = (queueLabel: string) => {
    return `${queueLabel}-${randomUUID()}`;
};
