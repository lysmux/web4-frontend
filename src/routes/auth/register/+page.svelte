<script lang="ts">
	import { resolve } from '$app/paths';
	import { goto } from '$app/navigation';
	import { z } from 'zod';

	import { vkAuth } from '$lib/auth/vk.ts';
	import apiClient from '$lib/api/api.ts';
	import type { ApiResponse } from '$lib/api/types';
	import type { AuthResponse, RegisterRequest } from '$lib/api/users.ts';

	import VKIcon from '../../../components/icons/VKIcon.svelte';
	import AuthForm from '../AuthForm.svelte';
	import FormField from '../../../components/forms/FormField.svelte';
	import Input from '../../../components/forms/Input.svelte';
	import Button from '../../../components/Button.svelte';

	const registerData: RegisterRequest = $state({
		username: '',
		email: '',
		password: '',
		confirmPassword: ''
	});
	const schema = z.object({
		username: z.string()
			.min(1, 'Поле обязательно')
			.min(4, 'Имя пользователя должно быть не короче 4 символов'),
		email: z.email('Введите корректную почту'),
		password: z.string()
			.min(1, 'Поле обязательно')
			.min(6, 'Пароль должен быть не короче 6 символов'),
		confirmPassword: z.string().min(1, 'Поле обязательно')
	}).refine(
		(data) => data.password === data.confirmPassword,
		{
			message: 'Пароли должны совпадать',
			path: ['confirmPassword']
		}
	);

	const parsed = $derived.by(() => {
		return schema.safeParse(registerData);
	});
	const isValid = $derived(parsed.success);
	const errors = $derived.by(() => {
		if (parsed.success) return {};
		return z.treeifyError(parsed.error).properties || {};
	});

	let loading = $state(false);

	const register = () => {
		if (!isValid) return;
		loading = true;

		apiClient.post<ApiResponse<AuthResponse>>('/auth/password/register', {
			username: registerData.username,
			email: registerData.email,
			password: registerData.password,
		})
			.then(response => response.data)
			.then(() => {
				goto(resolve('/auth/confirmation/'));
			})
			.finally(() => {
				loading = false;
			});
	};
</script>

<AuthForm onSubmit={register}>
	{#snippet title()}Регистрация{/snippet}

	{#snippet fields()}
		<FormField label="Имя пользователя" id="username">
			<Input
				id="username"
				bind:value={registerData.username}
				error={errors.username?.errors[0]}
			/>
		</FormField>
		<FormField label="Почта" id="email">
			<Input
				id="email"
				bind:value={registerData.email}
				error={errors.email?.errors[0]}
				type="email"
			/>
		</FormField>
		<FormField label="Пароль" id="password">
			<Input
				id="password"
				bind:value={registerData.password}
				type="password"
				error={errors.password?.errors[0]}
			/>
		</FormField>
		<FormField label="Повтор пароля" id="confirm-password">
			<Input
				id="confirm-password"
				bind:value={registerData.confirmPassword}
				type="password"
				error={errors.confirmPassword?.errors[0]}
			/>
		</FormField>
	{/snippet}

	{#snippet buttons()}
		<Button
			loading={loading}
			disabled={!isValid}
			type="submit"
			variant="action"
		>Зарегистрироваться
		</Button>
	{/snippet}

	{#snippet alternatives()}
		<Button onclick={vkAuth} size="sm">
			<VKIcon />
			ВКонтакте
		</Button>
	{/snippet}

	{#snippet changeAction()}
		Есть аккаунт? <a href={resolve("/auth/login")}>Войти</a>
	{/snippet}
</AuthForm>
