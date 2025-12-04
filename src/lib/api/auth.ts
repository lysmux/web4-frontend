import apiClient, { clearAccessToken } from '$lib/api/api.ts';
import { goto } from '$app/navigation';
import { resolve } from '$app/paths';

export const logout = async () => {
	clearAccessToken();

	await apiClient.post('/auth/logout');
	await goto(resolve('/auth/login'));
};