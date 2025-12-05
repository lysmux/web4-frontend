import { goto } from '$app/navigation';
import { resolve } from '$app/paths';
import type { LayoutLoad } from './$types';

import { isAccessTokenValid } from '$lib/api/api.ts';

export const ssr = false;
export const load: LayoutLoad = async () => {
	if (isAccessTokenValid()) {
		await goto(resolve("/control"))
	}
}