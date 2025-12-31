export class QueueRateLimitExceeded extends Error {
	statusCode: number;

	constructor(message: string) {
		super(message);
		this.name = "QueueRateLimitExceeded";
		this.statusCode = 429;
	}
}
