const COLORS = {
	reset: "\x1b[0m",
	green: "\x1b[32m",
	red: "\x1b[31m",
	cyan: "\x1b[36m",
};

export function createLogger() {
	const infoLogger = (message: string, meta?: object) => {
		console.log(
			`${COLORS.green}(@qaas/producer-sdk)[INFO]:${COLORS.reset} ${COLORS.cyan}${message}${COLORS.reset}`,
			meta || ""
		);
	};

	const errorLogger = (message: string, meta?: object) => {
		console.error(
			`${COLORS.red}(@qaas/producer-sdk)[ERROR]:${COLORS.reset} ${COLORS.cyan}${message}${COLORS.reset}`,
			meta || ""
		);
	};

	return {
		info: infoLogger,
		error: errorLogger,
	};
}
