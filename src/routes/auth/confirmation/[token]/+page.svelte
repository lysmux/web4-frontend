<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';

	import ProcessStatus from '../../../../components/ProcessStatus.svelte';

	import { onMount } from 'svelte';
	import apiClient, { updateAccessToken } from '$lib/api/api.ts';
	import type { AuthResponse } from '$lib/api/users.ts';
	import type { ApiResponse } from '$lib/api/types';

	const { token } = page.params;

	onMount(() => {
		apiClient.post<ApiResponse<AuthResponse>>('/auth/confirmation/' + token)
			.then(response => response.data)
			.then(data => {
				updateAccessToken(data.data);
				goto(resolve('/control'));
			});
	});
</script>

<ProcessStatus>Завершаем регистрацию...</ProcessStatus>