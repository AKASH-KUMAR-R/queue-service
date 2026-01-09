import api from "@/shared/api";
import {
	handleError,
	prettifyFieldErrors,
} from "@/shared/api/utils/handleError";
import { AxiosError } from "axios";

type LoginRequestPayload = {
	identifier: string;
	password: string;
};

type SignupRequestPayload = {
	email: string;
	name: string;
	password: string;
};

const login = async (data: LoginRequestPayload) => {
	try {
		const response = await api.post("/api/auth/login", data);

		return { data: response.data, error: null };
	} catch (err: unknown) {
		return {
			data: null,
			error: handleError(err),
			validationErrors: prettifyFieldErrors(
				err instanceof AxiosError ? err.response?.data : null,
			),
		};
	}
};

const signup = async (data: SignupRequestPayload) => {
	try {
		const response = await api.post("/api/auth/signup", data);

		return { data: response.data, error: null };
	} catch (err: unknown) {
		return {
			data: null,
			error: handleError(err),
			validationErrors: prettifyFieldErrors(
				err instanceof AxiosError ? err.response?.data : null,
			),
		};
	}
};

export default {
	login,
	signup,
};
