<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';

	import ProcessStatus from '../../../../components/ProcessStatus.svelte';

	import apiClient, { updateAccessToken } from '$lib/api/api.ts';
	import type { ApiResponse } from '$lib/api/types';
	import type { AuthResponse, VKCallbackRequest } from '$lib/api/users.ts';

	onMount(() => {
		const urlParams = new URLSearchParams(window.location.search);
		const state = urlParams.get('state');
		const code = urlParams.get('code');
		const deviceId = urlParams.get('device_id');

		const challengeVerifier = sessionStorage.getItem('challengeVerifier');
		const stateVerifier = sessionStorage.getItem('stateVerifier');

		if (
			state === null
			|| code === null
			|| deviceId === null
			|| stateVerifier === null
			|| state !== stateVerifier
		) {
			goto(resolve('/auth/login'));
		}

		const callbackData: VKCallbackRequest = {
			code: code as string,
			deviceId: deviceId as string,
			challengeVerifier: challengeVerifier as string
		};

		apiClient.post<ApiResponse<AuthResponse>>('/auth/callback/vk', callbackData)
			.then(response => response.data)
			.then(data => {
				updateAccessToken(data.data);
				goto(resolve('/control'));
			})
			.catch(() => {
				goto(resolve('/auth/login'));
			});
	});
</script>

<ProcessStatus>Вход через ВКонтакте...</ProcessStatus>