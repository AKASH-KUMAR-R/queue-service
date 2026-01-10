import type { FieldValues, Path, UseFormSetError } from "react-hook-form";

export const mapServerFieldErrorToFormFields = <
	TFieldvalues extends FieldValues,
>(
	setError: UseFormSetError<TFieldvalues>,
	errors: Record<string, string>,
) => {
	Object.entries(errors).forEach(([field, message]) =>
		setError(field as Path<TFieldvalues>, {
			type: "server",
			message: message,
		}),
	);
};
