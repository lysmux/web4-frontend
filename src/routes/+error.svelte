<script lang="ts">
	import { page } from '$app/state';

	const messageMap: Record<number, string> = {
		403: 'Доступ запрещен',
		404: 'Страница не найдена',
		500: 'Внутренняя ошибка сервера'
	};

</script>

<svelte:head>
	<title>{page.status} - Ошибка</title>
</svelte:head>

<div class="container">
	<p class="hint">Упс! Произошла ошибка</p>

	<div class="error">
		<h1>{page.status}</h1>
		{#if messageMap[page.status]}
			<p>{messageMap[page.status]}</p>
		{/if}
	</div>
</div>

<style lang="scss">
  .container {
		color: white;
    text-align: center;
    font-size: 2em;

    display: flex;
    flex-direction: column;
    gap: 32px;
  }

  .error {
    color: #727272;
  }
</style>
