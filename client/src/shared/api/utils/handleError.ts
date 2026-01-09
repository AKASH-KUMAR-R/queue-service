import { AxiosError } from "axios";

export const handleError = (error: unknown) => {
	if (error instanceof AxiosError) {
		const resData = error.response?.data;

		if (resData && typeof resData === "object") {
			// Extract and return a meaningful message from the response data

			if (
				"errors" in resData &&
				typeof resData.errors === "object" &&
				Array.isArray(resData.errors.formErrors)
			) {
				return (
					resData.errors?.formErrors.join(", ") || "An error occurred"
				);
			} else if (
				"message" in resData &&
				typeof resData.message === "string"
			) {
				return resData.message;
			} else if (
				"detail" in resData &&
				typeof resData.detail === "string"
			) {
				return resData.detail;
			} else {
				return JSON.stringify(resData);
			}
		} else {
			return error.message;
		}
	} else if (error instanceof Error) {
		return error.message;
	}

	return "An unknown error occurred";
};

export type ServerValidationError = {
	errors: {
		formErrors: string[];
		fieldErrors: Record<string, string[]>;
	};
};

export const prettifyFieldErrors = (
	responseValidationRes: ServerValidationError,
) => {
	if (!responseValidationRes || !responseValidationRes.errors?.fieldErrors) {
		return null;
	}

	return Object.entries(responseValidationRes.errors?.fieldErrors).reduce(
		(acc: Record<string, string>, curr: [string, string[]]) => {
			const [key, messages] = curr;
			acc[key] = messages.join("\n");
			return acc;
		},
		{},
	);
};
