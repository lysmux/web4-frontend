import axios, { type InternalAxiosRequestConfig } from 'axios';
import { goto } from '$app/navigation';
import { resolve } from '$app/paths';
import type { AuthResponse } from '$lib/api/users.ts';
import type { ApiResponse } from '$lib/api/types';
import { toasts } from 'svelte-toasts';
import { ERRORS_MAP } from '$lib/api/errors.ts';

const ACCESS_TOKEN_EXPIRE_AT_KEY = 'accessTokenExpireAt';
const ACCESS_TOKEN_KEY = 'accessToken';

const apiClient = axios.create({
	baseURL: 'https://web4.lysmux.dev/api',
	timeout: 10000,
	withCredentials: true
});

const refreshApiClient = axios.create({
	baseURL: 'https://web4.lysmux.dev/api',
	withCredentials: true
});

async function refreshAccessToken() {
	try {
		const res = await refreshApiClient.post<ApiResponse<AuthResponse>>('/auth/refresh-tokens');
		updateAccessToken(res.data.data)
	} catch (err) {
		await goto(resolve("/auth/login"))
		throw new Error('Unable to refresh access token', {cause: err});
	}
}

function updateAccessToken(data: AuthResponse): void {
	const expiresAt = Date.now() + data.expiresIn;
	localStorage.setItem(ACCESS_TOKEN_EXPIRE_AT_KEY, expiresAt.toString());
	localStorage.setItem(ACCESS_TOKEN_KEY, data.accessToken);
}

function clearAccessToken(): void {
	localStorage.removeItem(ACCESS_TOKEN_EXPIRE_AT_KEY);
	localStorage.removeItem(ACCESS_TOKEN_KEY);
}

function isAccessTokenValid(): boolean {
	const expireAt = Number(localStorage.getItem(ACCESS_TOKEN_EXPIRE_AT_KEY));
	const token = localStorage.getItem(ACCESS_TOKEN_KEY);

	if (!expireAt || !token) return false;

	return Date.now() < expireAt;
}

apiClient.interceptors.request.use(
	async (config: InternalAxiosRequestConfig & { requireAuth?: boolean }) => {
		const isAuthRoute = config.url?.startsWith('/auth/');
		if (isAuthRoute && !config.requireAuth) {
			return config;
		}

		if (!isAccessTokenValid()) {
			await refreshAccessToken();
		}

		config.headers["Authorization"] = `Bearer ${localStorage.getItem(ACCESS_TOKEN_KEY)}`;
		return config;
	},
	(error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config as InternalAxiosRequestConfig & {
			_retry?: boolean;
			requireAuth?: boolean;
		};
		const isAuthRoute = originalRequest.url?.startsWith('/auth/');
		if (isAuthRoute && !originalRequest.requireAuth) {
			handleAPIError(error);
			return Promise.reject(error);
		}

		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;

			try {
				await refreshAccessToken();
				return apiClient(originalRequest);
			} catch {
				clearAccessToken();

				handleAPIError(error);
				return Promise.reject(error);
			}
		}
		handleAPIError(error);
		return Promise.reject(error);
	}
);

function handleAPIError(error) {
	const errorCode = error.response?.data?.error?.code;

	toasts.add({
		title: 'Ошибка',
		description: errorCode ? ERRORS_MAP[errorCode] : error.message,
		placement: 'top-right',
		duration: 6000,
		showProgress: true,
		type: 'error'
	});
}

export { updateAccessToken, clearAccessToken };
export default apiClient;