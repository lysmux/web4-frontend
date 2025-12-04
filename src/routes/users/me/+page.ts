import apiClient from '$lib/api/api.ts';

import type { PageLoad } from './$types';
import type { User } from '$lib/api/users.ts';
import type { ApiResponse } from '$lib/api/types';

export const ssr = false;

export const load: PageLoad = async () => {
	return {
		user: apiClient
			.get<ApiResponse<User>>('/users/me')
			.then((response) => response.data)
			.then((data) => data.data)
	};
};
