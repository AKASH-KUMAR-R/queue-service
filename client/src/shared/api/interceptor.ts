import axios, { type AxiosInstance } from "axios";

//handling common errors and refresh token request
export const attachResponseInterceptor = (api: AxiosInstance) => {
	api.interceptors.response.use(
		(response) => response,
		async (err) => {
			const originalRequest = err.config;

			console.debug(err, "REACHED INTERCEPTOR");

			if (err.response?.status === 401 && !originalRequest._retry) {
				console.log("Token expired");

				try {
					//write refresh logic here

					await axios.post(
						import.meta.env.VITE_BACKEND_BASE_URL +
							"/token/refresh/",
						null,
						{
							withCredentials: true,
						},
					);

					//after successful refresh ,
					originalRequest._retry = true;

					return api(originalRequest); // try last failed request
				} catch (refreshError) {
					return Promise.reject(refreshError);
				}
			}

			return Promise.reject(err);
		},
	);
};
