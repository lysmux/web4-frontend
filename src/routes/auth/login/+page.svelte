<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { z } from 'zod';

	import { vkAuth } from '$lib/auth/vk.ts';
	import { passKeyAuth } from '$lib/auth/passkey.ts';
	import apiClient, { updateAccessToken } from '$lib/api/api.ts';
	import type { ApiResponse } from '$lib/api/types';
	import type { AuthResponse, LoginRequest } from '$lib/api/users.ts';

	import AuthForm from '../AuthForm.svelte';
	import Button from '../../../components/Button.svelte';
	import FormField from '../../../components/forms/FormField.svelte';
	import Input from '../../../components/forms/Input.svelte';
	import PassKeyIcon from '../../../components/icons/PassKeyIcon.svelte';
	import VKIcon from '../../../components/icons/VKIcon.svelte';

	const loginData: LoginRequest = $state({
		usernameOrEmail: '',
		password: ''
	});
	const schema = z.object({
		usernameOrEmail: z.string().min(1, 'Поле обязательно'),
		password: z.string().min(1, 'Поле обязательно')
	});

	const parsed = $derived.by(() => {
		return schema.safeParse(loginData);
	});
	const isValid = $derived(parsed.success);
	const errors = $derived.by(() => {
		if (parsed.success) return {};
		return z.treeifyError(parsed.error).properties || {};
	});

	let loading = $state(false);

	const login = () => {
		if (!isValid) return;
		loading = true;

		apiClient.post<ApiResponse<AuthResponse>>('/auth/password/login', loginData)
			.then(response => response.data)
			.then(data => {
				updateAccessToken(data.data);
				goto(resolve('/control'));
			})
			.finally(() => {
				loading = false;
			});
	};
</script>


<AuthForm onSubmit={login}>
	{#snippet title()}Вход{/snippet}

	{#snippet fields()}
		<FormField label="Имя пользователя / почта" id="usernameOrEmail">
			<Input
				id="usernameOrEmail"
				name="usernameOrEmail"
				bind:value={loginData.usernameOrEmail}
				error={errors.usernameOrEmail?.errors[0]}
			/>
		</FormField>

		<FormField label="Пароль" id="password">
			<Input
				id="password"
				name="password"
				type="password"
				bind:value={loginData.password}
				error={errors.password?.errors[0]}
			/>
		</FormField>
	{/snippet}

	{#snippet buttons()}
		<Button
			loading={loading}
			disabled={!isValid}
			type="submit"
			variant="action"
		>
			Войти
		</Button>
	{/snippet}

	{#snippet alternatives()}
		<Button onclick={vkAuth} size="sm">
			<VKIcon />
			ВКонтакте
		</Button>

		<Button onclick={passKeyAuth} size="sm">
			<PassKeyIcon />
			PassKey
		</Button>
	{/snippet}

	{#snippet changeAction()}
		Нет аккаунта? <a href={resolve("/auth/register")}>Зарегистрироваться</a>
	{/snippet}
</AuthForm>
