import { AxiosError } from "axios";
import { logger } from "../config/logger.config";

const handleError = (error: unknown): void => {
	if (error instanceof AxiosError) {
		logger.error("Axios Error:", {
			message: error.message,
			code: error.code,
			response: error.response?.data,
		});
	} else if (error instanceof Error) {
		logger.error("Error:", { message: error.message, stack: error.stack });
	} else if (typeof error === "string") {
		logger.error("Error:", { message: error });
	} else {
		logger.error("Unknown error occurred");
	}
};

export default handleError;
