import { type AxiosInstance } from "axios";

import { unauthorizedApi } from "./axiosConfig";

let requestQueue: Array<{ resolve: Function; reject: Function }> = [];
let isRefreshing = false;

const processQueue = (error: Error | string | null) => {
	requestQueue.forEach((request) => {
		if (error) {
			request.reject(error);
		} else {
			request.resolve();
		}
	});

	requestQueue = [];
};

//handling common errors and refresh token request
export const attachResponseInterceptor = (api: AxiosInstance) => {
	api.interceptors.response.use(
		(response) => response,
		async (err) => {
			const originalRequest = err.config;

			if (err.response?.status === 401 && !originalRequest._retry) {
				originalRequest._retry = true;

				if (isRefreshing) {
					try {
						console.log(
							"Token refresh in progress, queuing request...",
							originalRequest.url,
						);
						const promise = new Promise((resolve, reject) => {
							requestQueue.push({ resolve, reject });
						});

						await promise;

						return api(originalRequest);
					} catch (err) {
						return Promise.reject(err);
					}
				}

				try {
					isRefreshing = true;

					await unauthorizedApi.post(
						"/api/auth/refresh-token",
						null,
						{
							withCredentials: true,
						},
					);

					processQueue(null);
					return api(originalRequest); // try last failed request
				} catch (refreshError: unknown) {
					console.log("Token refresh failed:", refreshError);
					if (refreshError instanceof Error) {
						processQueue(refreshError);
					} else {
						processQueue("Unknown error during token refresh");
					}
					return Promise.reject(refreshError);
				} finally {
					isRefreshing = false;
				}
			}

			return Promise.reject(err);
		},
	);
};
